import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import handlebars from 'handlebars';

handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

handlebars.registerHelper('not', function (v1) {
  return !v1;
});

describe('Navbar Handlebars', () => {
  let htmlContent;

  const navbarTemplate = `
  <header class='bg-gray-800 text-white py-4'>
    <nav class='container mx-auto flex justify-between'>
      <div class="flex items-center space-x-6">
        <a href='/' class='text-xl font-bold'>
          SolidarianID
        </a>

        {{#if (eq user.roles 'admin')}}
        <a id="dashboard" href='/validation' class='hover:underline'>
          Dashboard
        </a>
        {{/if}}
      </div>

      <ul id="navbar" class='flex space-x-4'>
        {{#if (not user)}}
        <li>
          <a href='/login' class='hover:underline'>
            Login
          </a>
        </li>
        <li>
          <a href='/register' class='hover:underline'>
            Register
          </a>
        </li>
        {{/if}}

        {{#if user}}
        <p class="text-base">Welcome, {{user.firstName}} {{user.lastName}} [ {{user.roles}} ]</p>
        <li>
          <a href='/logout' class='hover:underline'>
            Logout
          </a>
        </li>
        {{/if}}
      </ul>
      <div class="md:hidden">
        <button id="menu-toggle" class="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </nav>
    <div id="mobile-menu" class="hidden md:hidden bg-gray-800 text-white p-4">
      <ul class="space-y-6">
        {{#if (not user)}}
        <li>
          <a href='/login' class='hover:underline'>
            Login
          </a>
        </li>
        <li>
          <a href='/register' class='hover:underline'>
            Register
          </a>
        </li>
        {{/if}}

        {{#if user}}
        <li>
          <p class="text-base">Welcome, {{user.firstName}} {{user.lastName}} [ {{user.roles}} ]</p>
        </li>
        <li>
          {{#if (eq user.roles 'admin')}}
          <a href='/validation' class='hover:underline'>
            Dashboard
          </a>
          {{/if}}
        </li>
        <li>
          <a href='/logout' class='hover:underline'>
            Logout
          </a>
        </li>
        {{/if}}
      </ul>
    </div>
  </header>
  `;

  // Function to process the template and render it with data
  const renderTemplate = (data) => {
    const template = handlebars.compile(navbarTemplate);
    return template(data);
  };

  beforeEach(() => {
    const user = null;
    htmlContent = renderTemplate(user);
    document.body.innerHTML = htmlContent;
  });

  it('should display the Login link when the user is NOT authenticated', () => {
    // Verify that the Login link appears
    const links = screen.getAllByText(/login/i);
    expect(links.length).toBe(2);
    expect(links[0]).toBeInTheDocument();
  });

  it('should NOT display the Dashboard link when the user is NOT authenticated', () => {
    // Verify that the Dashboard link does not appear
    const links = screen.queryAllByText(/dashboard/i);
    expect(links.length).toBe(0);
  });

  it('should display the Register link when the user is NOT authenticated', () => {
    // Verify that the Register link appears
    const links = screen.getAllByText(/register/i);
    expect(links.length).toBe(2);
    expect(links[0]).toBeInTheDocument();
  });

  it('should display the Welcome message when the user is authenticated', () => {
    // Set the user data
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      roles: ['user'],
    };

    // Render the template with the user data
    const htmlContent = renderTemplate({ user });
    document.body.innerHTML = htmlContent;

    // Verify that the Welcome message appears
    expect(document.body).toHaveTextContent('Welcome, John Doe [ user ]');
  });
});
