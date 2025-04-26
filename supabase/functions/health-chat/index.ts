import { createClient } from 'npm:@supabase/supabase-js@2.39.3'
import { Configuration, OpenAIApi } from 'npm:openai@4.24.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()

    if (!message) {
      throw new Error('Message is required')
    }

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    // Create the system message that defines the AI's role and limitations
    const systemMessage = `You are a helpful health information assistant. Your role is to:
- Provide general health information and wellness advice
- Explain common medical terms and conditions in simple terms
- Suggest general lifestyle and wellness tips
- Direct users to seek professional medical help when appropriate

You must:
- Always include a clear disclaimer that you are not providing medical advice
- Be clear about limitations and uncertainties
- Encourage consulting healthcare professionals for specific medical concerns
- Avoid making specific diagnoses or treatment recommendations
- Focus on general health education and wellness information
- Be empathetic while maintaining professional boundaries

You must not:
- Diagnose specific conditions
- Recommend specific treatments or medications
- Give specific medical advice
- Make promises about health outcomes
- Pretend to be a healthcare professional`

    // Get completion from OpenAI using GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",  // Changed to GPT-4
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0].message.content

    return new Response(
      JSON.stringify({ response }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})