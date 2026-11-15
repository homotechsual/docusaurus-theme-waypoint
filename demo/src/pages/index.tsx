import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const features = [
  {
    title: 'One guide, two views',
    description: 'Readers can switch between the whole guide and one step at a time without maintaining two copies.',
  },
  {
    title: 'Navigation built in',
    description: 'A progress bar, jump menu, and Back and Next buttons help readers find their way through a guide.',
  },
  {
    title: 'Checklists that follow along',
    description: 'Optional checklist items appear on their matching steps and keep their state between visits.',
  },
  {
    title: 'Made for your content',
    description: 'Choose heading levels and wrappers, translate the interface, and opt in only the guides you want.',
  },
];

export default function Home(): React.JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={`hero hero--primary ${styles.hero}`}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link className="button button--secondary button--lg" to="/docs/guide">
              Try the Demo Guide →
            </Link>
            <Link className={`button button--outline button--secondary button--lg ${styles.docsButton}`} to="/docs/intro">
              Read the Docs
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.features} aria-label="Waypoint features">
          <div className="container">
            <div className="row">
              {features.map(({title, description}) => (
                <div key={title} className="col col--3">
                  <div className="padding-horiz--md">
                    <Heading as="h3">{title}</Heading>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="container padding-bottom--xl">
          <Heading as="h2">Inspired by dotMARC</Heading>
          <p>
            Waypoint grew out of the documentation for dotMARC, a self-hosted DMARC monitoring tool.
            See its deployment guide for a more complex, real-world example with nested steps and checklists.
          </p>
          <Link to="https://dotmarc.app/docs/deploy-with-docker/">Explore the dotMARC deployment guide →</Link>
        </section>
      </main>
    </Layout>
  );
}
