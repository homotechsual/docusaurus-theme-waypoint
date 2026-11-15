import React from 'react';
import Link from '@docusaurus/Link';

export default function Home(): React.ReactElement {
  return (
    <main className="container margin-vert--lg">
      <h1>Waypoint theme demo</h1>
      <p>Try switching this guide between the whole page and one step at a time.</p>
      <Link className="button button--primary" to="/docs/guide">
        Open the demo guide
      </Link>
    </main>
  );
}
