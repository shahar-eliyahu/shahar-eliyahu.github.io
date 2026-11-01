---
title: Anyone Can Cook
subtitle: AI-Planned, Step-by-Step Cooking for Beginners
summary: >-
  A Hebrew-first Android app that turns any recipe, pasted as text,
  photographed, or added as a link, into a guided cooking session with one clear
  step at a time, parallel tasks while you wait, and reliable timers. Google
  Gemini turns recipes into structured plans and powers Remy, a voice-enabled
  cooking assistant, while a deterministic engine on the phone runs the cooking
  itself, even offline.
type: Full-Stack Mobile Application with AI
categories: [applications]
technologies: [Flutter, Dart, SQLite (drift), Riverpod, Python, FastAPI, Pydantic, Google Gemini]

# Second in the explorer, right after EasyFill (owner decision; a fraction keeps
# the other projects' `order` values unchanged).
order: 1.5

links:
  github: https://github.com/shahar-eliyahu/Anyone-Can-Cook-App

# Explorer gallery. Media: src/assets/projects_media/anyone-can-cook/
# All portrait phone screenshots, shown whole (`fit: contain`).
cover:
  src: 01-home.png
  alt: "Home screen with the app name, a Cooking now card for shakshuka at step 2 of 4 with a running timer and a Continue cooking button, a New recipe card, and the user's saved recipes"
  fit: contain
gallery:
  - src: 05-cooking.png
    alt: "Cooking mode for shakshuka at step 2 of 4, frying the vegetables: the instruction, what the step needs (olive oil, onion, red pepper, garlic), a 06:51 timer with pause, add a minute and timer options, and buttons for Remy and the next step"
    fit: contain
  - src: 06-remy-voice.png
    alt: "Remy's assistant panel open over the shakshuka cooking screen, marked as listening, with the prompt 'You can ask me anything about the recipe', a large microphone button, and stop and keyboard options"
    fit: contain
  - src: 03-catalog.png
    alt: "Built-in recipe catalog with a search field, category chips (all, quick, chicken, pasta, baking) and recipes such as an omelette, shakshuka, pancakes, French toast and several pasta dishes, each with its time, servings and tags"
    fit: contain

# Detail page: /projects/anyone-can-cook/. All copy is owner-approved and was
# checked against the Anyone-Can-Cook-App repository (rate limits are per IP;
# links are pasted into the app, there is no Android share target).
detailPage: true
caseStudy:
  sections:
    - id: overview
      title: Project Overview
      text: |-
        Most recipes assume you already know how to cook. Anyone Can Cook turns any recipe into a calm, guided session: one clear action per step, timers that start when you do, reminders for what to prepare ahead, and an assistant you can talk to while your hands are busy.

        Users can bring their own recipe as text, a photo, or a link, choose one of 24 built-in recipes, or ask the assistant to suggest one. Every AI-generated plan is shown for review before cooking starts.

        The app is Hebrew-first and fully right-to-left, and is currently in a private Android beta.
      media:
        - src: 01-home.png
          alt: "Home screen with the app name, a Cooking now card for shakshuka at step 2 of 4 with a running timer and a Continue cooking button, a New recipe card, and the user's saved recipes: shakshuka, pancakes and a sample oven chicken recipe"
          caption: Home screen with the cooking session in progress and the user's saved recipes.

    - id: features
      title: Key Features
      items:
        - title: Any Recipe, Made Cookable
          text: |-
            Paste a recipe, photograph it, or paste a link, and the backend uses Gemini to turn it into a structured cooking plan with ingredients, equipment, steps, dependencies, and timers. The user reviews the plan before cooking.
        - title: Built-In Recipes
          text: |-
            24 ready recipes, from shakshuka to chocolate cake, with search and categories. They work fully offline.
          media:
            - src: 03-catalog.png
              alt: "Built-in recipe catalog with a search field, category chips (all, quick, chicken, pasta, baking) and recipes such as an omelette, shakshuka, pancakes, French toast and several pasta dishes, each with its time, servings and tags"
              caption: The built-in recipe catalog with search and category filters.
        - title: Preparation and Substitutions
          text: |-
            A checklist for ingredients and equipment before cooking. Simple substitutions are answered on the phone, offline; anything recipe-specific is sent to the server, which reasons about the particular recipe.
        - title: Guided Cooking
          text: |-
            One action per step, with parallel tasks suggested while something cooks. Several timers can run at once, with notifications even when the app is closed, and cooking progress survives closing the app or restarting the phone.
          media:
            - src: 05-cooking.png
              alt: "Cooking mode for shakshuka at step 2 of 4, frying the vegetables: the instruction, what the step needs (olive oil, onion, red pepper, garlic), a 06:51 timer with pause, add a minute and timer options, and buttons for Remy and the next step"
              caption: Cooking mode, showing the current step, what it needs, and a running timer.

    - id: remy
      title: Meet Remy, the Cooking Assistant
      text: |-
        Remy is the app's cooking assistant. He knows the recipe and exactly where the user is in it.

        - **Hands-free voice:** With hands-free mode on in the cooking screen, Remy listens for the wake phrase "היי רמי", so the user doesn't need to touch the phone.
        - **Instant basics, even offline:** Simple commands such as next step, previous step, and time remaining are handled on the phone.
        - **Real answers:** Questions about techniques, substitutions, or what to do next go to Gemini, with the recipe and the current step as context.
        - **The user stays in control:** Remy suggests actions; important actions run only after the user confirms.
      media:
        - src: 06-remy-voice.png
          alt: "Remy's assistant panel open over the shakshuka cooking screen, marked as listening, with the prompt 'You can ask me anything about the recipe', a large microphone button, and stop and keyboard options"
          caption: Remy listening during cooking, opened over the current step.

    - id: demo
      title: App Demo
      text: |-
        A screen recording on an Android phone: the recipe catalog and the new-recipe options, then a basic omelette from the preparation checklist, through each cooking step and its timers, to the finished meal and the cooking history. The recording has no sound.
      media:
        - video: Demo.mp4
          title: Anyone Can Cook demo
          poster: anyone-can-cook-video-poster.webp

    - id: architecture
      title: "Architecture: AI Plans, the App Executes"
      text: |-
        Gemini is used where language understanding helps: turning recipes into plans, creating recipes, suggesting substitutions, and answering questions. Cooking itself runs on a deterministic engine on the phone, so steps, timers, and progress never depend on the network, and recipes are stored on the device.

        The app and the backend share one contract: Pydantic models on the server are exported as JSON Schema and mirrored by Dart models in the app, with contract tests on both sides. Gemini responses are requested as structured JSON against these schemas and validated before use. Plans are also checked structurally (for example, step dependencies), and numbers labeled as coming from the original recipe are verified against the source text, including Hebrew number words and fractions.

        **Workflow**

        1. Recipe input: text, photo, link, built-in catalog, or a request to Remy.
        2. FastAPI backend: Gemini analysis and planning with structured output.
        3. Validation: schema, plan structure, and source-number checks.
        4. User review of the plan on the phone.
        5. Deterministic cooking engine with local storage, timers, and notifications.
      media:
        - src: Architecture.png
          alt: "Architecture diagram: inside the Flutter app, Screens and Remy lead to the Cooking engine, which drives Timers and notifications and the Local database; Screens and Remy also send recipes and questions to the FastAPI backend, which calls Google Gemini"

    - id: reliability
      title: Reliability, Safety & Security
      text: |-
        - **Reliable timers:** Timers use exact Android alarms where permitted, are restored when the app starts or resumes and after the phone reboots, and open the right cooking session when tapped.
        - **Food safety values are not AI-generated:** Safe cooking temperatures come from a curated table based on USDA FSIS guidance, and the app never claims a dish is guaranteed safe.
        - **Safe link fetching:** Recipe links are fetched by the server with protection against requests to private or internal network addresses, with each redirect checked.
        - **Protected AI access:** The Gemini API key exists only on the server. AI endpoints have per-IP rate limits and an app-wide daily cap.

    - id: testing
      title: Testing
      text: |-
        The project includes more than 200 automated Flutter tests and more than 140 automated backend tests, covering the cooking engine, plan validation, timers and session restore, the assistant and voice commands, recipe import, data storage, the AI pipeline, and the API.

        Key flows were also verified on an Android emulator, including offline cooking, several timers at once, notifications with the app closed, and timer restoration after a force stop and after a device reboot.

    - id: technology
      title: Technology & Methodology
      tools:
        - name: Flutter & Dart
          use: Android app with a Hebrew, right-to-left interface.
        - name: Riverpod & go_router
          use: State management and navigation.
        - name: SQLite (drift)
          use: Local storage for recipes, plans, sessions, and history.
        - name: Python & FastAPI
          use: Backend API for analysis, planning, substitutions, and the assistant.
        - name: Pydantic & JSON Schema
          use: Shared contract between the backend and the app.
        - name: Google Gemini
          use: Recipe understanding, planning, and assistant answers through structured output.
        - name: Speech to text & text to speech
          use: Hands-free voice interaction with Remy.
        - name: Render
          use: Backend hosting.

    - id: source-code
      title: Explore the Source Code
      text: |-
        Explore the Flutter app, the FastAPI backend, the shared schemas, and the tests, including the deterministic cooking engine, the AI planning pipeline, and the Remy assistant.
      links:
        - label: View Source Code on GitHub
          url: https://github.com/shahar-eliyahu/Anyone-Can-Cook-App
---
