---
title: Displaying a Deployment Status Badge for your Next.js App on your Github Readme 
description: "Some webapp deployment providers, like Netlify, automatically generate badges for displaying the deployment status of your project. Others, like Vercel, don't. This article shows how to easily display a badge for your project regardless of your provider."
date: '2020-11-28'
featured: true
topics: Next.js,Vercel,Github,Badge Generator
recommended: blog-with-next-js-react-material-ui-and-typescript
---


Some webapp deployment providers, like Netlify, automatically generate badges for displaying the deployment status of your project. Others, like Vercel, don't. 

It is, however, quite straight forward to implement your own solution for this use case if you use a provider that is integrated with the Github API, like [Vercel](https://vercel.com).



I have published an [NPM package](https://www.npmjs.com/package/deployment-badge) *deployment-badge* to use with your Next.js app, so you can get started as fast as possible. This blog [(Github)](https://github.com/FelixMohr/nextjs-material-ui-blog) is an example of an app using *deployment-badge*. 
 
![Github Badges](/images/badges.png)
 
Let's see how to use this package. 


## How to use the NPM package to display a status badge on your Readme

Install *deployment-badge* with your package manager:

``yarn add deployment-badge`` or ``npm install --save deployment-badge``

Create an API handler as follows in the directory *pages/api* of your Next.js project:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next'
import deploymentBadgeHandler from 'deployment-badge'

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await deploymentBadgeHandler(req, res, { deploymentsUrl: DEPLOYMENTS_URL, namedLogo: 'vercel', env: 'Production' })
}

export default handler
```
If you aren't using typescript, simply omit the types above.


The third parameter of ``deploymentBadgeHandler`` accepts these values as options:

* *deploymentsUrl*: The Github API deployments URL of your project, e.g. https://api.github.com/repos/FelixMohr/nextjs-material-ui-blog/deployments 
* *namedLogo*: A logo to include in the generated badge. Any name from [Simple Icons](https://simpleicons.org/) can be chosen. Can be omitted.
* *env*: The environment for which to generate the badge. Can be omitted, default is *Production*

This handler will generate JSON responses that can be used by [Shields.io](https://shields.io), from where they will be added to the README.md:

```markdown
[![Deployment Status](https://img.shields.io/endpoint?url=https://devx.sh/api/deployment)](https://devx.sh)
```

Replace the URL above with the URL of your deployed handler.

## Check out the source code of *deployment-badge*

The source code of this project is quite concise itself. If you are interested, you can find the whole code at [Github](https://github.com/FelixMohr/deployment-badge).
