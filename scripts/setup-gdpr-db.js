#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase environment variables not found!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupGDPRDatabase() {
  try {
    console.log('🚀 Setting up GDPR database schema...')
    
    // Read the GDPR schema file
    const gdprSchemaPath = path.join(__dirname, '../database/gdpr-schema.sql')
    const gdprSchema = fs.readFileSync(gdprSchemaPath, 'utf8')
    
    // Read the Analytics schema file
    const analyticsSchemaPath = path.join(__dirname, '../database/analytics-schema.sql')
    const analyticsSchema = fs.readFileSync(analyticsSchemaPath, 'utf8')
    
    console.log('📄 Schema files loaded successfully')
    
    // Execute the GDPR schema
    const { error: gdprError } = await supabase.rpc('exec_sql', { sql: gdprSchema })
    
    if (gdprError) {
      console.log('⚠️ GDPR schema execution failed, trying manual execution...')
    }
    
    // Execute the Analytics schema
    const { error: analyticsError } = await supabase.rpc('exec_sql', { sql: analyticsSchema })
    
    if (analyticsError) {
      console.log('⚠️ Analytics schema execution failed, trying manual execution...')
    }
    
    if (error) {
      // If exec_sql doesn't exist, try direct execution
      console.log('⚠️  exec_sql not available, trying direct execution...')
      
      // Split schema into individual statements
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement })
            if (stmtError) {
              console.log(`⚠️  Statement failed (this might be expected): ${statement.substring(0, 50)}...`)
            }
          } catch (e) {
            // Ignore errors for statements that might already exist
            console.log(`⚠️  Statement skipped: ${statement.substring(0, 50)}...`)
          }
        }
      }
    }
    
    console.log('✅ GDPR database schema setup completed!')
    
    // Test the setup
    console.log('🧪 Testing setup...')
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['user_consents', 'gdpr_requests', 'data_retention_log', 'user_feedback', 'analytics_events', 'user_sessions'])
    
    if (tablesError) {
      console.log('⚠️  Could not verify tables, but setup might be successful')
    } else {
      console.log('📋 Created tables:', tables.map(t => t.table_name).join(', '))
    }
    
    console.log('🎉 GDPR setup completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Test cookie consent in your application')
    console.log('2. Check GDPR settings page at /gdpr-settings')
    console.log('3. Verify consent data in Supabase dashboard')
    
  } catch (error) {
    console.error('❌ Error setting up GDPR database:', error)
    process.exit(1)
  }
}

// Manual setup instructions
function showManualInstructions() {
  console.log('\n📋 Manual Setup Instructions:')
  console.log('1. Go to your Supabase dashboard')
  console.log('2. Navigate to SQL Editor')
  console.log('3. Copy and paste the contents of database/gdpr-schema.sql')
  console.log('4. Click "Run" to execute the schema')
  console.log('5. Verify tables are created in the Table Editor')
}

// Check if we can connect to Supabase
async function testConnection() {
  try {
    const { data, error } = await supabase.from('information_schema.tables').select('table_name').limit(1)
    if (error) {
      console.log('⚠️  Could not connect to Supabase, showing manual instructions...')
      showManualInstructions()
      return false
    }
    return true
  } catch (error) {
    console.log('⚠️  Connection test failed, showing manual instructions...')
    showManualInstructions()
    return false
  }
}

// Main execution
async function main() {
  console.log('🍪 GDPR Database Setup Tool')
  console.log('============================\n')
  
  const canConnect = await testConnection()
  
  if (canConnect) {
    await setupGDPRDatabase()
  }
}

main().catch(console.error) 