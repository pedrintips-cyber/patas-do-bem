import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { transaction_id, external_id, status, amount, customer } = body;

    console.log('Webhook received:', { transaction_id, external_id, status, amount });

    if (status === 'approved') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, serviceRoleKey);

      // Insert donation record
      const amountInReais = Math.round(amount / 100);
      const { error } = await supabase.from('donations').insert({
        name: customer?.name || 'Anônimo',
        email: customer?.email || null,
        amount: amountInReais,
        campaign_id: external_id?.startsWith('campaign-') ? external_id.split('campaign-')[1]?.split('-')[0] : null,
        campaign_name: 'Doação PIX',
        type: 'campaign',
        order_bump: false,
      });

      if (error) {
        console.error('Error inserting donation:', error);
      } else {
        console.log('Donation recorded successfully for transaction:', transaction_id);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
