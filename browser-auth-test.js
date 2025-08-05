// Paste this in browser console after login to test auth directly

async function testAuthNow() {
    const debugToken = localStorage.getItem('debug_accessToken');
    
    console.log('🧪 IMMEDIATE AUTH TEST');
    console.log('Token exists:', !!debugToken);
    console.log('Token value:', debugToken?.substring(0, 20) + '...');
    
    if (!debugToken) {
        console.error('❌ No token in localStorage');
        return;
    }
    
    try {
        const response = await fetch('https://client-work-jyoti-prakash.onrender.com/api/v1/users/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${debugToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ AUTH SUCCESS:', data);
        } else {
            const errorData = await response.text();
            console.error('❌ AUTH FAILED:', errorData);
        }
    } catch (error) {
        console.error('❌ REQUEST FAILED:', error);
    }
}

// Run the test
testAuthNow();
