---
title: ChatGPT For Developers: A Look at 10 Examples 
date: 2023-10-8
tags: chatgpt, programming, AI
---

# ChatGPT For Developers: A Look at 10 Examples

### Charles Johnson, Software Engineer

#### 10-8-2023

---

ChatGPT is a hot topic in the tech community, especially among software developers, as it has the potential to assist in everyday workflows.
I've personally been using ChatGPT 4.0 to help with programming tasks, including the creation of this website.
Here are some potential use cases for ChatGPT, and my take on the results. Some inputs and outputs have been edited for brevity and clarity.

**Note**: Never trust ChatGPT's output without testing it yourself, and if you aren't able or sure how to test it, try an online search or ask a colleague instead.  
ChatGPT is not infallible and will output answers that are irrelevent, inaccurate, or unhelpful.
It and similar AIs are known to "hallucinate", essentially making statements that are confident but incorrect.
[Source1](<https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)>)
[Source2](https://www.nytimes.com/2023/05/01/business/ai-chatbots-hallucination.html)
[Source3](https://www.wired.com/story/fast-forward-chatbot-hallucinations-are-poisoning-web-search/)

## 1. Creating Code Challenges

**Me:** Please generate some suboptimal JS code, maybe like 5 or 6 lines. Then I'll try to improve it and you can grade my solution

**ChatGPT:** Sure, here is some suboptimal JavaScript code:

```js
function sumEvenNumbers(arr) {
  var sum = 0
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) {
      sum += arr[i]
    }
  }
  return sum
}

console.log(sumEvenNumbers([1, 2, 3, 4, 5, 6]))
```

This code will find the sum of all even numbers in an array. Try to improve this code and then I'll grade your solution.

**Me:**

```js
const sumEvenNumbers = (arr) => arr.filter((x) => x % 2 === 0).reduce((a, b) => a + b)
```

**ChatGPT:** Nice work! Your solution is concise and functional. Here's your rating:

Correctness: 10/10
Readability: 10/10
Performance: 9/10

Overall: 29/30

Note: The filter method creates a new array with all elements that pass the test implemented by the provided function, and the reduce method executes a reducer function on each element of the array, resulting in a single output value. These methods are very efficient and suitable for this task, but keep in mind that creating a new array with filter has some memory overhead compared to just iterating through the original array. However, this is a minor issue and in most cases, the improved readability and conciseness of your solution would be preferred.

Great job!

**My Take:** I appreciate that without specific prompting, it graded my answer in 3 different categories. The point taken off for performance, and the explanation for it, seems accurate. It would be nice if it mentioned the terms "imperative" and "declarative".

## 2. Generating SVGs

**Me:** Generate an svg favicon that is 64x64 and has the text "CbC"

**ChatGPT:** Certainly! I can provide you with an SVG markup for a favicon with the text "CbC". However, keep in mind that SVGs are textual representations, so the following is a simple SVG content and may need to be further styled for your exact needs.

```svg
<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect width="100%" height="100%" fill="#FFFFFF"/>

    <!-- Text "CbC" -->
    <text x="50%" y="50%" font-family="Arial" font-size="32" text-anchor="middle" alignment-baseline="middle" fill="#000000">CbC</text>
</svg>
```

**My Take:** The SVG is what I asked for and would work as a favicon in a pinch.

## 3. Exploring Programming Conventions

**Me:** In React.JS, is it considered common practice to capitalize the names of files? (about.tsx vs About.tsx)

**ChatGPT:** Yes, in the React.js community, it is generally considered common practice to capitalize the names of component files. This is not a technical requirement from React itself, but a convention that many developers follow to indicate that a file exports a React component. So, you would typically name your file as About.tsx rather than about.tsx.

Moreover, when you import this file, it becomes clear that you're importing a component and not a regular JavaScript module or utility function:

```jsx
import About from './About'
```

However, this is not a hard and fast rule. Consistency across a project is most important, so whether you choose to capitalize component files or not, it's best to stick with one naming convention throughout the project.

**My Take:** The output is accurate, though it didn't mention PascalCase by name. For questions like this, it may be better to just do an online search.

## 4. Explaining Programming Paradigms

**Me:** Explain "Progressive Enhancement"

**ChatGPT:** Progressive enhancement is a design philosophy that centers around providing a basic level of user experience to all end users by starting with a minimal level of user interface, then enhancing the system for those with advanced browser software or greater bandwidth. This approach aims to deliver functionality and aesthetics based on the capabilities of the user's system.

Here's a breakdown of how it works:

Basic content layer: First and foremost, the core of a web page should be built using only HTML. At this level, the content should be accessible to all web browsers and should be organized semantically. This ensures that all users can access the essential information and functionality of the website, even if their browser or device doesn't support more advanced features.

Presentation layer: Next, CSS is added to enhance the visual appearance of the website. This includes layout, colors, fonts, and other aesthetic elements. If a user's browser or device doesn't support certain CSS features, the website will still be usable; it just won't look as polished.

Client-side scripting layer: Finally, JavaScript (or other client-side scripting languages) is added to provide additional interactivity and improve the user experience. This could include things like form validation, animations, and dynamic content loading. Again, if a user's browser or device doesn't support JavaScript, they can still access the core content and functionality of the website.

This approach ensures that the essential content and functionality of a website is accessible to as many users as possible, regardless of their device or browser capabilities. It also allows developers to utilize the latest web technologies without excluding users who can't use or prefer not to use these technologies.

Progressive enhancement is often contrasted with another design philosophy called "graceful degradation". While progressive enhancement starts with a baseline experience and builds up, graceful degradation starts with a full experience and then tries to ensure that it still works in less-capable browsers or devices.

**My Take:** The output seems accurate. It is a bit more specific (mentions CSS and HTML) than this [MDN doc](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) and seems more akin to a summary of the [Progressive Enhancement Wikipedia Article](https://en.wikipedia.org/wiki/Progressive_enhancement).
The main benefit of using ChatGPT here is that you can follow up by asking clarifying questions, eg "What are some CSS features that are not supported by all browsers"

## 5. Testing

**Me:** How can I simulate the user pressing a key in Testing Library React?

**ChatGPT:** In order to simulate the user pressing a key in the context of React Testing Library, you can use the fireEvent.keyDown or fireEvent.keyPress function.

For instance, to simulate a user pressing the 'Enter' key, your test might look like this:

```jsx
import { render, fireEvent } from '@testing-library/react'

test('simulates pressing a key', () => {
  const handleKeyDown = jest.fn()

  const { getByTestId } = render(<input data-testid="input-test" onKeyDown={handleKeyDown} />)

  fireEvent.keyDown(getByTestId('input-test'), { key: 'Enter', code: 'Enter' })

  expect(handleKeyDown).toHaveBeenCalled()
})
```

This test does the following:

It creates a mock function, handleKeyDown, using jest.fn(). This function is used to verify if the onKeyDown prop has been called.
It uses the render function from @testing-library/react to render a component. This component is an input element with an onKeyDown prop (which uses the mock function) and a data-testid attribute for easier querying.
It uses the fireEvent.keyDown function to simulate a key press. It targets the component using getByTestId, which queries the component by its data-testid attribute. It passes an object with key and code properties to represent the 'Enter' key.
It asserts that the handleKeyDown function has been called, which would indicate that the key press was successful.
Please remember to adjust your test case based on the specific requirements of your application. For example, if you are testing a component that should update its state or props when a key is pressed, your assertion might look different.

In addition, please consider whether a fireEvent or userEvent is more appropriate for your test case. userEvent is a library built on top of fireEvent that provides a more realistic simulation of user behavior, but may not be necessary for all test cases. You can import userEvent from @testing-library/user-event

**My Take:** The output is technically accurate, but I think it would be better if the example used userEvent instead of fireEvent, as that should be the default ([Source](https://testing-library.com/docs/user-event/intro))

## 6. Comparing Tools

**Me:** Compare Vite with Remix

**ChatGPT:** As of my knowledge cutoff in September 2021, Vite and Remix are two different tools used in web development, with some overlap but also distinctive strengths. Here's a comparison of the two:

1. **Goal:**

   **Vite:** Vite (which means "fast" in French) is a build tool created by Evan You, the creator of Vue.js. Its primary goal is to provide a faster and leaner development experience for modern web projects. It provides features like hot module replacement and esbuild-powered fast bundling for production.

   **Remix:** Remix is a comprehensive web framework for building better web applications. It's built with a focus on leveraging the browser's fetch API and it provides a seamless experience for data loading. The main focus of Remix is to provide developers with a robust framework for building web applications that are fast and efficient, making full use of the latest capabilities of the web platform.

2. **Design Philosophy:**

   **Vite:** Vite takes advantage of native ES modules (ESM) in modern browsers for development, allowing you to serve your code to the browser with minimal bundling during development. This approach results in significantly faster update times compared to traditional webpack-based tooling.

   **Remix:** Remix emphasizes a "do it the browser way" philosophy, it uses browser fetch for data loading, which lets you isolate different parts of your app and have them update independently without global state.

3. **Framework Compatibility:**

   **Vite:** Vite is designed to be framework-agnostic. It can be used with any framework that can compile to JavaScript and work in the browser, including Vue, React, Preact, and more.

   **Remix:** Remix is built primarily for React applications.

4. **Performance:**

   **Vite:** Vite greatly improves the speed of the development server start and hot-module replacement.

   **Remix:** The Remix team has paid particular attention to performance with progressive rendering and streaming servers out of the box.

5. **Routes:**

   **Vite:** In Vite, routing largely depends on the framework you are using. If you use Vite with Vue, you'll use Vue Router. If you use it with React, you might use React Router or another choice.

   **Remix:** Remix has its own built-in routing system, which is file-system based, and supports nested routing and data loading.

6. **Data Fetching:**

   **Vite:** Like routing, data fetching in Vite would depend on the framework you're using and its ecosystem.

   **Remix:** Remix provides built-in components and hooks to handle data fetching, caching, error boundaries, loading states, and more, all tied into the routing system.

Please note that the landscape of web development tools evolves rapidly, and the information might have changed beyond my knowledge cutoff in September 2021. You should look up the latest resources to get the most up-to-date comparison.

**My Take:** The output seems accurate. There isn't much of a summary here, like "Remix is more opinionated", but the question was very broad.

## 7. Generating Documentation

**Me:** Here is my package.json file. Please generate a README section consisting of some of the most important tools used, and a very short description of each. eg "- Vite: Build tool. - React: UI library."

```json
{
  "name": "app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "@sentry/react": "^7.57.0",
    "@tldraw/tldraw": "^2.0.0-alpha.14",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-google-recaptcha": "^3.1.0",
    "react-helmet-async": "^1.3.0",
    "react-markdown": "^8.0.7",
    "react-router-dom": "^6.14.1",
    "react-simple-keyboard": "^3.7.8",
    "react-syntax-highlighter": "^15.5.0"
  },
  "devDependencies": {
    "@sentry/vite-plugin": "^2.4.0",
    "@tailwindcss/typography": "^0.5.10",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/node": "^20.4.0",
    "@types/nspell": "^2.1.3",
    "@types/react": "^18.0.37",
    "@types/react-dom": "^18.0.11",
    "@types/react-google-recaptcha": "^2.1.5",
    "@types/react-syntax-highlighter": "^15.5.7",
    "@typescript-eslint/eslint-plugin": "^5.59.0",
    "@typescript-eslint/parser": "^5.59.0",
    "@vitejs/plugin-react-swc": "^3.0.0",
    "autoprefixer": "^10.4.14",
    "eslint": "^8.38.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.3.4",
    "jsdom": "^22.1.0",
    "postcss": "^8.4.24",
    "prettier": "^2.8.8",
    "react-test-renderer": "^18.2.0",
    "tailwindcss": "^3.3.2",
    "typescript": "^5.0.2",
    "vite": "^4.3.9",
    "vite-bundle-visualizer": "^0.8.0",
    "vitest": "^0.33.0"
  }
}
```

**ChatGPT:** Based on the `package.json` file you provided, below is a section you can include in your `README.md` file to describe some of the important tools used in your project:

```markdown
## Key Tools and Libraries Used

### [Vite](https://vitejs.dev/): Build Tool

- **Vite:** A build tool that aims to provide a faster and leaner development experience for modern web projects. It serves your code via native ES modules, allowing you to develop your application without a bundler.

### [React](https://reactjs.org/): UI Library

- **React:** A declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called “components”.

### [React-DOM](https://reactjs.org/docs/react-dom.html): React Renderer to the DOM

- **React-DOM:** Provides DOM-specific methods that can be used at the top level of a React app to enable an efficient way of managing
```

**Me:** (After Pressing the "Stop Generating" button) Those are a bit long. Can you make the output shorter like this? Vite: Build tool. React: UI library.

**ChatGPT:** Certainly! Below is a concise section for your `README.md`:

```markdown
## Key Tools and Libraries

- **[Vite](https://vitejs.dev/):** Build tool.
- **[React](https://reactjs.org/):** UI library.
- **[React-DOM](https://reactjs.org/docs/react-dom.html):** React renderer to the DOM.
- **[React-Router-DOM](https://reactrouter.com/):** DOM bindings for React Router.
- **[React-Helmet-Async](https://github.com/staylor/react-helmet-async):** Manage document head tags.
- **[React-Markdown](https://github.com/remarkjs/react-markdown):** Markdown component for React.
- **[React-Google-Recaptcha](https://github.com/dozoisch/react-google-recaptcha):** Google's reCAPTCHA component for React.
- **[React-Syntax-Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter):** Syntax highlighter component for React.
- **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework.
- **[ESLint](https://eslint.org/):** JavaScript linter.
- **[TypeScript](https://www.typescriptlang.org/):** Typed superset of JavaScript.
- **[Prettier](https://prettier.io/):** Code formatter.
```

**My Take:** The result highlights and summarizes the most important packages. Because ChatGPT has a knowledge cutoff (at least with this version), you cannot trust it to generate proper links. For example, the React-DOM link leads to deprecated docs. Documentation needs and styles can differ quite a bit between different companies and teams, so ChatGPT may need extra instructions to make something useful. Overall it might be better to hand-craft your documentation to make sure it is accurate and useful.

## 8. Styling

**Me:** Please update this code. It should use Tailwind CSS for styling, and take up the full screen. It should also work on mobile. For Tailwindcss breakpoints, use nothing (medium or smaller) and "md" for medium and larger devices. Here is the basic skeleton:

```jsx
<div>
  <h1>404</h1>
  <p>Page Not Found</p>
  <p>The page you are looking for might have been removed or is temporarily unavailable.</p>
</div>
```

**ChatGPT:** Certainly! You want to create a simple 404 error page React component using Tailwind CSS for styling that's responsive across different devices.

Firstly, ensure you have Tailwind CSS installed in your React project. If not, you can install it via npm or yarn, and configure it based on the Tailwind CSS documentation.

Below is a simple example of a `NotFound` component with Tailwind CSS classes added for styling:

```jsx
import React from 'react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-md shadow-md text-center">
        <h1 className="text-6xl text-red-500 font-bold mb-4">404</h1>
        <p className="text-2xl mb-4">Page Not Found</p>
        <p className="text-gray-500">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>
      </div>
    </div>
  )
}

export default NotFound
```

Explanation of Tailwind CSS classes used:

- `min-h-screen`: Minimum height of the container is set to the height of the screen.
- `flex items-center justify-center`: These classes center the child div both horizontally and vertically using Flexbox.
- `bg-gray-200`: Sets the background color of the container to a light gray.
- `bg-white p-8 rounded-md shadow-md`: These classes style the 404 message box with a white background, padding, rounded corners, and a shadow for a card-like appearance.
- `text-6xl text-red-500 font-bold mb-4`: Styles the 404 text with size, color, font weight, and bottom margin.
- `text-2xl mb-4`: Styles the “Page Not Found” text with size and bottom margin.
- `text-gray-500`: Sets the color of the explanatory text to a medium gray.

Before you use this code, ensure your project is set up to work with React and Tailwind CSS, and that you've imported and used the `NotFound` component in a way that it gets displayed when a page is not found. For proper navigation management, consider using React Router or a similar library to handle different routes and display the 404 page accordingly.

For the responsiveness, Tailwind CSS utility classes inherently provide responsiveness. If you need more custom styling at different breakpoints, you can use Tailwind's responsive design features by prefixing classes with the appropriate breakpoint (e.g., `md:text-2xl` to set text size at the medium breakpoint). Adjust as necessary for your design needs!

**My Take:** The result works well, and the extra explanations are nice. However, developers should always scrutinize ChatGTP's code instead of blindly copying it into their projects. And learning the technology in-depth (in this case Tailwind CSS) will absolutely save time over asking ChatGPT every time you need to make a change.

## 9. Databases

**Me:** Let's say I have a .sql file that creates and populates various tables. I'd like to quickly create a local postgres db, load the sql file, and query the results using the command line. My machine is WSL2 Ubuntu. Be sure to set up any necessary users and passwords.

**ChatGPT:** Creating and populating a PostgreSQL database from a `.sql` file on a machine with WSL2 Ubuntu can be done with a few steps. Here's a step-by-step guide to achieving that:

1. **Install PostgreSQL**:

   - First, you'll need to have PostgreSQL installed on your machine. If it's not already installed, you can do so with the following command:
     ```bash
     sudo apt-get update
     sudo apt-get install postgresql postgresql-contrib
     ```

2. **Start PostgreSQL**:

   - Now, start the PostgreSQL service:
     ```bash
     sudo service postgresql start
     ```

3. **Create a New User**:

   - Create a new user for PostgreSQL with the following command. Replace "your_username" and "your_password" with your desired username and password:
     ```bash
     sudo -u postgres createuser -P your_username
     ```

4. **Create a New Database**:

   - Create a new database, replacing "your_database_name" with the desired name for your database:
     ```bash
     sudo -u postgres createdb -O your_username your_database_name
     ```

5. **Load the .sql File**:

   - Now, it's time to load your `.sql` file into the database you just created. Replace "path_to_your_file.sql" with the path to your `.sql` file:
     ```bash
     psql -U your_username -d your_database_name -f path_to_your_file.sql
     ```

6. **Query the Database**:

   - Now, you can query the database using the `psql` command-line tool:
     ```bash
     psql -U your_username -d your_database_name
     ```
   - Once inside the `psql` interface, you can run SQL queries directly. For example, to see all the tables in your database, you'd type:
     ```sql
     \dt
     ```

7. **Exit PostgreSQL**:
   - When you're finished, you can exit the `psql` interface by typing:
     ```sql
     \q
     ```

This process sets up a local PostgreSQL database, loads a `.sql` file, and allows you to query the results using the command line on a machine with WSL2 Ubuntu.

**My Take:** Worked well. ChatGPT is great for these kinds of tasks where you want to get something done fast and don't require a lot of rigor.

## 10. Understanding Code

**Me:** Can you explain what this code does, annotate it, and give an example of its use?

```scheme
(define ???
 ((lambda (le)
   ((lambda (f) (f f))
   (lambda (f)
     (le (lambda (x) ((f f) x))))))
 (lambda (length)
   (lambda (l)
     (cond
       ((null? l) 0)
       (else
         (add1 (length (cdr l)))))))))
```

**ChatGPT:** Certainly! This code is written in Scheme, a dialect of Lisp. It’s a bit tricky due to the use of higher-order functions and anonymous functions (lambdas). Let’s break it down part by part.

### Code Breakdown:

```scheme
(define ???
  ((lambda (le)
    ((lambda (f) (f f))
    (lambda (f)
      (le (lambda (x) ((f f) x))))))
  (lambda (length)
    (lambda (l)
      (cond
        ((null? l) 0)
        (else
          (add1 (length (cdr l)))))))))
```

### Annotations:

1. `(define ??? ...)` - Defines a new function named `???`.

2. `(lambda (le) ...)` - This creates an anonymous function that takes one argument, `le`.

3. `((lambda (f) (f f)) (lambda (f) (le (lambda (x) ((f f) x)))))` - This part applies a self-application trick often seen in the Y combinator. It helps to define recursive anonymous functions.

4. The innermost lambda `(lambda (x) ((f f) x))` uses the self-application trick to recursively call itself, effectively making it a recursive function.

5. `(lambda (length) (lambda (l) ...))` - This is the actual recursive function being passed to the higher-order function. It calculates the length of a list `l`.

6. `(cond ((null? l) 0) (else (add1 (length (cdr l)))))` - This is the base and recursive cases for the length calculation. If the list is empty `(null? l)`, it returns 0. Otherwise, it recursively calls `length` on the rest of the list `(cdr l)` and adds 1 to the result.

### Example Usage:

Here's how you might use this function to calculate the length of a list:

```scheme
(???(list 1 2 3 4 5)) ; Output: 5
```

### Summary:

The `???` function is a recursive function to calculate the length of a list. It’s constructed using anonymous functions and higher-order functions, demonstrating concepts like closures and the Y combinator-style recursion technique in Scheme.

**My Take:** I am not enough of a scheme guru to tell if the annotations are accurate, but it is correct that the function calculates the length of a list and uses the Y combinator! Chat GPT's ability to 'understand' code can be very impressive.
[Scheme code from: Friedman, Daniel P., and Matthias Felleisen. “12. Take Cover.” The Seasoned Schemer, MIT Press, Cambridge, MA, 2000]

## Conclusion

Note that these examples _are_ somewhat cherry-picked!
ChatGPT is sometimes completely unable to output anything helpful, and often requires additional prompting to produce something useful.
And again, developers need to carefully validate all its outputs.

In spite of its limitations, ChatGPT 4.0 can be a useful tool in a developer's toolbox.
I'm looking forward to seeing it become even more powerful over time.
