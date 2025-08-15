// Test the unit works
 
import { NetworkUnit} from './network.unit.js';

if (import.meta.url === `file://${process.argv[1]}`) {
  async function testNetworkUnit() {
    console.log('🧪 TESTING NETWORK UNIT v1.0.0');
    console.log('===============================\n');
    
    const network = NetworkUnit.create({ baseUrl: 'https://test.api.com' });
    
    console.log('📋 Identity:', network.whoami());
    console.log('📚 Help:'); 
    network.help();
    console.log('🎯 Capabilities:', network.capabilities().list());
    
    // Test GET
    const getResult = await network.get('/test');
    console.log('📡 GET Result:', getResult);
    
    // Test POST  
    const postResult = await network.post('/create', { name: 'Test User' });
    console.log('📡 POST Result:', postResult);
    
    // Test teaching
    const contract = network.teach();
    console.log('🎓 Teaching Contract:', {
      unitId: contract.unitId,
      capabilities: contract.capabilities.list(),
      hasSchema: !!contract.schema,
      hasValidator: !!contract.validator
    });
    
    console.log('\n✅ NetworkUnit v1.0.0 works perfectly!');
    return network;
  }
  
  testNetworkUnit().catch(console.error);
} 