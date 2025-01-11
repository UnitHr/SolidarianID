import { screen } from '@testing-library/dom';
import '@testing-library/jest-dom';
import handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { resolve } from 'path';
handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

handlebars.registerHelper('not', function (v1) {
  return !v1;
});

describe('Navbar Handlebars', () => {
  let htmlContent;
  const navbarTemplate = readFileSync(
    resolve(__dirname, '../views/partials/navbar.hbs'),
    'utf8',
  );

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
