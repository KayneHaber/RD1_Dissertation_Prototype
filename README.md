# React XSS Linter

RD1 Milestone 2 prototype.

A static analysis tool that scans React source code for Cross-Site
Scripting (XSS) vulnerabilities and suggests a secure fix for each one.

## Background

React escapes rendered content by default, so XSS vulnerabilities in React
applications usually come from a small set of escape hatches that
developers reach for: `dangerouslySetInnerHTML`, dangerous URLs in `href`
or `src`, and direct DOM manipulation through `innerHTML` or `eval`. This
tool parses React files into an Abstract Syntax Tree (AST) and inspects
that structure to find those patterns.

## Research questions

This prototype supports the two research questions from Milestone 1:

1. How can XSS vulnerabilities introduced during frontend development be
   detected more effectively using automated approaches?
2. How can automated techniques be used to improve the mitigation of XSS
   vulnerabilities while remaining practical for developers to use within
   their workflow?

Detection of the patterns addresses the first question; the suggested fix
attached to each finding addresses the second.

## Tech stack

- Node.js and TypeScript
- Babel (`@babel/parser`, `@babel/traverse`) for AST parsing of JSX/TSX

## Setup

```
npm install
```

## Usage

```
npm run scan <path-to-react-file>
```

## Status

Stage 1 of 5 complete: project scaffold. The scanner core and the four
detectors are added in the following stages.
