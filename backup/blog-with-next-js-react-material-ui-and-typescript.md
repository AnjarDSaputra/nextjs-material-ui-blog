---
title: Setting up a Blog with Next.js, React, Material-UI and Typescript
description: "In this series of posts, I am going to describe how I implemented the blog you are looking at. This blog is based 
on the technologies mentioned in the title. This article will be all about getting them to work together smoothly."
date: '2020-11-22'
featured: true
topics: Next.js,React,Material-UI,Typescript
recommended: material-ui-toggle-theme
---

## My own Next.js blog – how it all started 

So finally, there it is – my own blog to write about the technologies I love and I work with everyday. And like many developers 
out there, I didn't want to choose a prebuilt solution for my blog. Instead, I wanted to build it on my own, so it will be possible
to really understand what it is doing under the hood. Of course, I wanted to make use of technologies that I was (partially) already familiar with and 
that make sense for this project. 


As I apply [React](https://reactjs.org/) almost daily at work, I chose this framework to be the core of my blog. And as this is a blog, and therefore it is 
serving static content, I chose [Next.js](https://nextjs.org/) as a solution for generating this content once on the server, instead of having it been rendered 
every time someone visits a page on the blog. This is much different
from the usual client-side rendering taking place with apps based on React and other single-page frameworks, and provides a significant
performance-boost. On a side note: Next.js does not only allow for [static generation](https://nextjs.org/docs/basic-features/pages#static-generation-recommended)
as we are going to see it applied here, it also makes [server-side rendering](https://nextjs.org/docs/basic-features/pages#server-side-rendering)
possible, which means that the server generates the content at every request. This may be necessary for example to always access the most current
data from a database, but is nothing that we have to deal with for our purposes.

To have a solid basis for the blog UI, I chose [Material-UI](https://material-ui.com/). As it turned out, some configuration was necessary to 
make this framework play well together with Next.js. Integrating [Typescript](https://www.typescriptlang.org/) was very simple however, as Next.js
takes care of all the necessary steps.

## Setting up the Next.js blog project

*You can find the complete code shown in this post at [https://github.com/FelixMohr/nextjs-material-ui-blog](https://github.com/FelixMohr/nextjs-material-ui-blog)*

### Next.js with Typescript

Starting a new Next.js project is as easy as running ``npx create-next-app``. This command sets up the basic project structure to work with.
Just as the [create react app](https://create-react-app.dev/) project that you are probably familiar with, create-next-app automatically 
adds some scripts to your package.json to build your project or to run it in development mode. For running it, execute ``yarn dev``.
To integrate Typescript into your project, just create an empty _tsconfig.json_ (``touch tsconfig.json``). Next.js will detect 
this file and initialize it. 

Now, add _@types/node_ and _@types/react_ and of course _typescript_ to your dev-dependencies. The reason for the node types is 
that we are going to write server-side code for rendering, and there we will need modules such as ``fs`` and ``path``.

You can change the file extension of all Javascript files in your project to _.ts_ or _.tsx_ now and immediately start
working with Typescript, no further steps are necessary here. 

### Integrating Material-UI with Next.js

It's a bit more involved to make Next.js integrate with Material-UI. 

First, install all of the necessary dependencies and one dev-dependency:
```json
    "@material-ui/core": "^4.11.0",
    "@material-ui/icons": "^4.9.1",
    "@material-ui/styles": "^4.10.0",
...
    "@types/material-ui": "^0.21.8",
```

The reason for us having to do some additional work here is that Material-UI makes heavy use of styled components. Styled components can be applied in [server-side](https://styled-components.com/docs/advanced#server-side-rendering) generated code,
but this makes it necessary for the developer to perform some additional steps. Luckily, the Material-UI team prepared a [starter project](https://github.com/mui-org/material-ui/blob/master/examples/nextjs) that demonstrates 
well what has to be done. Basically, you need to follow these steps:

1. create a custom file _/pages/\_document.tsx_ and add fill it as follows:

```typescript
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';
import theme from '../src/theme';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:300,400,500,700&display=swap" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto+Slab:300,400,500,700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
```
_\_document.ts_ is a file which is processed on server-side only. What we are doing here is collecting the necessary CSS styles generated by Material-UI and injecting them into the  document as a string.
This way, we avoid any flickering when the client receives the page. If we were to skip the above step, the client would initially display the 
page which was rendered on the server and then inject its own styles, which could cause flickering.

Feel free to add types to this document – I keep it as it is in the original repository, as we'll not have to further adapt it.

2. In your _\_app.tsx_, apply a ``useEffect`` hook to remove the CSS that were injected on server-side from the client-side app:

```typescript
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])
``` 
By doing this, we allow the client to take over styling the app as soon as its ready.

To better understand what these two steps do, we can take a look into the generated HTML page of any document. Right at the top, it contains a section as follows:

```html
<style id="jss-server-side">.MuiSvgIcon-root {
  fill: currentColor;
  width: 1em;
  height: 1em;
  display: inline-block;
  font-size: 1.5rem;
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  flex-shrink: 0;
  user-select: none;
}
.MuiSvgIcon-colorPrimary {
  color: #0f4c75;
}
.MuiSvgIcon-colorSecondary {
  color: #3282b8;
}
<!-- ... -->
</style>
```
According to the state of the app on client-side, these values may need to change. This blog, for example, has a light mode. The values 
above will be active with the dark mode only. When activating the light mode and inspecting the active styles with the developer tools,
we can see the following entry:
```css
.MuiSvgIcon-colorPrimary {
  color: #6886c5;
}
```
That's why the server-side values are removed on the client.

In general, if you have some setup code in your components that you only want to execute on the client, this can be achieved with
the _useEffect_ hook and an empty dependency array. However, this should be done as sparingly as possible, as otherwise we
lose the benefits of having a pre-rendered page with a minimum amount of Javascript code having to be executed by the clients.

By the way: if you see warnings such as the following, they will be resolved by the two steps just mentioned:

    Warning: Prop 'className' did not match. Server: "MuiTypography-root-246 MuiTypography-title-252 MuiTypography-colorInherit-265 PageComponent-flex-207" Client: "MuiTypography-root-44 MuiTypography-title-50 MuiTypography-colorInherit-63 PageComponent-flex-5"

## Adding themes to the blog with Material-UI themes

As far as the basic project setup goes, we are all done now, and can start to theme our Next.js app with [Material-UI themes](https://material-ui.com/customization/theming/). You may have noticed that our _\_document.tsx_ already makes use of the selected theme:
```typescript
<meta name="theme-color" content={theme.palette.primary.main} />
```
In the further posts of this article series, I'm going to talk about some additional ``meta`` tags that can be added dynamically
using Next.js. The [``theme-color``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color) value tells 
user agents how to style the UI surrounding the displayed page and this way enhances the user experience.

![Theme Color](/images/theme-color.png)
_Image credit: from [Icons & Browser Colors](https://developers.google.com/web/fundamentals/design-and-ux/browser-customization), created and shared by Google and used according to terms described in the Creative Commons 4.0 Attribution License._

I wanted to make it possible in my blog for the user to chose between a dark and a light mode. We'll see in the next post how toggling the 
theme can be implemented. Therefore, I wrote both a dark and a light theme in _src/theme/theme.ts_:

```typescript
import { createMuiTheme, ThemeOptions } from '@material-ui/core'

export const paletteColorsDark = {
  primary: '#0f4c75',
  secondary: '#3282b8',
  error: '#E44C65',
  background: '#1b262c',
  text: '#bbe1fa',
}

export const paletteColorsLight = {
  primary: '#6886c5',
  secondary: '#ffe0ac',
  error: '#E44C65',
  background: '#f9f9f9',
  text: '#050505',
}

const options = (dark: boolean): ThemeOptions => {
  const paletteColors = dark ? paletteColorsDark : paletteColorsLight
  return {
    palette: {
      type: dark ? 'dark' : 'light',
      primary: {
        main: paletteColors.primary,
      },
    // ...
    }
  }
}
export const darkTheme = createMuiTheme(options(true))
export const lightTheme = createMuiTheme(options(false))
```

And that's it for the basic setup! If you would like to see some of the actual implementation details
of my blog – e.g., how the articles are saved in Markdown files and transformed into website content 
with syntax highlighting on the server side by Next.js, stay tuned for the next articles in this series. 