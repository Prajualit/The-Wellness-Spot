// Paste this in browser console after login to test auth directly

async function testAuthNow() {
    console.log('🧪 IMMEDIATE AUTH TEST');

    try {
        const response = await fetch('https://client-work-jyoti-prakash.onrender.com/api/v1/users/me', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        console.log('Response status:', response.status);

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
