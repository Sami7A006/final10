import { createClient } from 'npm:@supabase/supabase-js';
import Snoowrap from 'npm:snoowrap';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const reddit = new Snoowrap({
  userAgent: 'NutriNexus/1.0.0',
  clientId: Deno.env.get('REDDIT_CLIENT_ID'),
  clientSecret: Deno.env.get('REDDIT_CLIENT_SECRET'),
  refreshToken: Deno.env.get('REDDIT_REFRESH_TOKEN'),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const product = url.searchParams.get('product');

    if (!product) {
      return new Response(
        JSON.stringify({ error: 'Product parameter is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const subreddits = ['SkincareAddiction', 'beauty', 'MakeupAddiction'];
    const searchResults = await Promise.all(
      subreddits.map(sub =>
        reddit.getSubreddit(sub)
          .search({ query: product, time: 'year', sort: 'relevance', limit: 5 })
      )
    );

    const reviews = searchResults
      .flat()
      .map(post => ({
        source: 'Reddit',
        title: post.title,
        content: post.selftext.substring(0, 300) + (post.selftext.length > 300 ? '...' : ''),
        url: `https://reddit.com${post.permalink}`,
        date: new Date(post.created_utc * 1000).toISOString(),
      }))
      .slice(0, 10);

    return new Response(
      JSON.stringify(reviews),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Reddit reviews' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});