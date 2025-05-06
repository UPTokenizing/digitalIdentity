// app/pages/login/auth.js
const login = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const { token, user } = await response.json();

        // Guardar el token y la información del usuario
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log("email" + user.email);
      
	    localStorage.setItem('userEmail', user.email); // Asume que el objeto `user` tiene un campo `email`

        // Redirigir al dashboard
        window.location.href = '/';
    } catch (error) {
        console.error('Login error:', error);
        alert(error.message || 'Login failed');
    }
};

// Verificar autenticación en páginas protegidas
const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/login';
    }
};

// Agregar el token a todas las peticiones fetch
const addAuthHeader = () => {
    const originalFetch = window.fetch;
    window.fetch = function () {
        const token = localStorage.getItem('authToken');
        if (token) {
            if (!arguments[1]) {
                arguments[1] = {};
            }
            if (!arguments[1].headers) {
                arguments[1].headers = {};
            }
            arguments[1].headers.Authorization = `Bearer ${token}`;
        }
        return originalFetch.apply(this, arguments);
    };
};

// Ejecutar al cargar la página
addAuthHeader();    
