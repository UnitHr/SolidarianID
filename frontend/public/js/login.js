document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe por defecto

    const email = loginForm.email.value;
    const password = loginForm.password.value;
    try {
      // Send data to the backend
      const response = await axios.post(
        'http://localhost:3000/api/v1/users/auth/login',
        {
          email,
          password,
        },
      );
      console.log('Login response:', response.data.token);

      const { access_token } = response.data.access_token;

      // Save the token in localStorage
      localStorage.setItem('token', access_token);
      console.log('Token saved:', token);

      // Redirect to the user authenticated home page
      //window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert('Invalid email or password.');
    }
  });
});
