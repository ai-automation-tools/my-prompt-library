// Performance diagnostic script
import fetch from 'node-fetch';

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testPerformance() {
  console.log('🔍 Performance Diagnostic Report\n');
  console.log('='.repeat(60));
  
  // Test 1: API Response Time (lightweight)
  console.log('\n📊 Test 1: API Response Time (Lightweight Mode)');
  const start1 = Date.now();
  const res1 = await fetch(`${API_URL}/api/prompts?library=public&lightweight=true`);
  const data1 = await res1.json();
  const end1 = Date.now();
  const size1 = JSON.stringify(data1).length;
  
  console.log(`  ⏱️  Response Time: ${end1 - start1}ms`);
  console.log(`  📦 Payload Size: ${(size1 / 1024).toFixed(2)} KB`);
  console.log(`  📝 Prompt Count: ${data1.length}`);
  console.log(`  💾 Avg per prompt: ${(size1 / data1.length).toFixed(0)} bytes`);
  
  // Test 2: API Response Time (full content)
  console.log('\n📊 Test 2: API Response Time (Full Content)');
  const start2 = Date.now();
  const res2 = await fetch(`${API_URL}/api/prompts?library=public&lightweight=false`);
  const data2 = await res2.json();
  const end2 = Date.now();
  const size2 = JSON.stringify(data2).length;
  
  console.log(`  ⏱️  Response Time: ${end2 - start2}ms`);
  console.log(`  📦 Payload Size: ${(size2 / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  📝 Prompt Count: ${data2.length}`);
  console.log(`  💾 Avg per prompt: ${(size2 / data2.length).toFixed(0)} bytes`);
  
  // Test 3: Single prompt fetch
  if (data1.length > 0) {
    console.log('\n📊 Test 3: Single Prompt Fetch Time');
    const promptId = data1[0].id;
    const start3 = Date.now();
    const res3 = await fetch(`${API_URL}/api/prompts/${encodeURIComponent(promptId)}`);
    const data3 = await res3.json();
    const end3 = Date.now();
    
    console.log(`  ⏱️  Response Time: ${end3 - start3}ms`);
    console.log(`  📦 Content Size: ${(JSON.stringify(data3).length / 1024).toFixed(2)} KB`);
  }
  
  // Test 4: Cache effectiveness (second request)
  console.log('\n📊 Test 4: Cache Effectiveness (Repeat Request)');
  const start4 = Date.now();
  const res4 = await fetch(`${API_URL}/api/prompts?library=public&lightweight=true`);
  await res4.json();
  const end4 = Date.now();
  
  console.log(`  ⏱️  Response Time: ${end4 - start4}ms`);
  console.log(`  🚀 Improvement: ${((1 - (end4 - start4) / (end1 - start1)) * 100).toFixed(1)}%`);
  
  // Analysis
  console.log('\n' + '='.repeat(60));
  console.log('📈 Analysis & Recommendations:\n');
  
  if (end1 - start1 > 2000) {
    console.log('⚠️  Lightweight API is SLOW (>2s)');
    console.log('   → Consider pagination or database indexing');
  } else if (end1 - start1 > 500) {
    console.log('⚠️  Lightweight API is acceptable but could be faster');
    console.log('   → Consider pagination for better UX');
  } else {
    console.log('✅ Lightweight API is fast (<500ms)');
  }
  
  if (size1 / 1024 > 1000) {
    console.log('⚠️  Payload is large (>1MB)');
    console.log('   → Implement pagination or virtual scrolling');
  } else if (size1 / 1024 > 500) {
    console.log('⚠️  Payload is moderate (>500KB)');
    console.log('   → Consider pagination for mobile users');
  } else {
    console.log('✅ Payload size is reasonable');
  }
  
  if (data1.length > 500) {
    console.log('⚠️  Large dataset (' + data1.length + ' items)');
    console.log('   → Implement virtual scrolling or pagination');
    console.log('   → Consider breaking into sections/categories');
  }
  
  console.log('\n' + '='.repeat(60));
}

testPerformance().catch(console.error);
