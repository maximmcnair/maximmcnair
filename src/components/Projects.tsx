import React from "react";
import Image from "next/image";

interface Props {}

export const Projects: React.FC<Props> = ({}) => {
  return (
    <section className="projects">
      <span>Projects</span>

      <article className="work">
        <div className="work-media">
          <Image
            src="/img/work_inmysize.jpg"
            alt="InMySize"
            width={617}
            height={386}
            quality={100}
          />
        </div>
        <div className="work-desc">
          <h3 className="work-desc-title">InMySize</h3>
          <p className="work-desc-paragraph">
            InMySize is a streetwear shopping app that shows users clothing from
            multiple stores that are currently in stock. Sizes are continuously
            updated using Node-based crawlers. As a personal project, I designed
            and built it across web and mobile platforms using React.
          </p>
          <ul className="tags">
            <li>React Native</li>
            <li>Node JS</li>
            <li>Koa</li>
            <li>MongoDB</li>
            <li>Design</li>
          </ul>
        </div>
      </article>

      <article className="work">
        <div className="work-media">
          <Image
            src="/img/work_keepyouraxesharp.jpg"
            alt="KeepTheAxeSharp"
            width={617}
            height={386}
            quality={100}
          />
        </div>
        <div className="work-desc">
          <h3 className="work-desc-title">Keep The Axe Sharp</h3>
          <p className="work-desc-paragraph">
            Keep The Axe Sharp uses flashcards and a repetition spaced learning
            algorithm to help programmers commit easy forgotten patterns, edge
            cases and shortcuts to memory.
          </p>
          <p className="work-desc-paragraph">
            The front end is built in es6 React, backed up with an API built in
            node.js.
          </p>
          <ul className="tags">
            <li>React</li>
            <li>Node JS</li>
            <li>Gulp</li>
            <li>Design</li>
          </ul>
          <a
            href="http://keeptheaxesharp.com/"
            target="_blank"
            rel="noreferrer"
            className="btn work-desc-btn"
          >
            View Project
          </a>
        </div>
      </article>
    </section>
  );
};
