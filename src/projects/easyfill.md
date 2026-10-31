---
title: EasyFill
subtitle: AI-Powered Accessibility & Form Assistance
summary: >-
  EasyFill is an Android application developed to help individuals with PTSD
  complete complex bureaucratic forms. It combines intelligent document
  processing, automatic form completion, multimodal distress detection, and
  adaptive accessibility support to simplify the process and reduce cognitive
  load.
type: Final-Year Software Engineering Project
categories: [applications]
technologies: [Kotlin, Jetpack Compose, Firebase, Node.js, Google Cloud Run, Azure AI Document Intelligence]

order: 1
featured: true
featuredOrder: 1

links:
  github: https://github.com/shahar-eliyahu/EasyFill

# Explorer gallery. Media: src/assets/projects_media/easyfill/images/
cover:
  src: easyfill-main-app.jpeg
  alt: "EasyFill welcome screen: the app logo, its Hebrew name, a short greeting offering help with filling in forms, and a button to continue to sign-in"
  fit: contain
gallery:
  - src: automatic-fill.jpeg
    alt: Personal details form filled in automatically from an uploaded document, with the personal values blurred; every field has microphone and speaker buttons
    fit: contain
  - src: personlized-recommandation.jpeg
    alt: The digital assistant's pop-up suggesting a change of screen colours, with black-and-white and purple night colour options
    fit: contain

# Detail page: /projects/easyfill/. All copy below was supplied by the owner.
detailPage: true
caseStudy:
  sections:
    - id: overview
      title: Project Overview
      text: |-
        EasyFill is a final-year software engineering project focused on making bureaucratic processes more accessible for individuals living with post-traumatic stress disorder (PTSD).

        Complex forms, repetitive data entry, and lengthy administrative procedures can create significant cognitive and emotional challenges. EasyFill addresses these difficulties by combining AI-powered form automation with personalized accessibility and real-time distress-aware assistance.
      media:
        - src: easyfill-main-app.jpeg
          alt: "EasyFill welcome screen: the app logo, its Hebrew name, a short greeting offering help with filling in forms, and a button to continue to sign-in"

    - id: features
      title: Key Features
      items:
        - title: Intelligent Document Processing & Autofill
          text: |-
            EasyFill uses Azure AI Document Intelligence to extract information from previously completed PDF documents and automatically populate matching fields in supported forms.

            Users can review and edit the information before continuing, reducing repetitive data entry and simplifying form completion.
          media:
            - src: form-upload-screen.jpg
              alt: Document upload screen where the user can choose a completed PDF so its details can fill in the form, or continue without uploading
            - src: automatic-fill.jpeg
              alt: Personal details form filled in automatically from an uploaded document, with the personal values blurred; every field has microphone and speaker buttons
        - title: Multimodal Distress Detection
          text: |-
            The application analyzes voice, facial behavior, hand movements, and form interactions to identify possible signs of distress.

            By combining multiple signals and comparing them with personalized baselines, EasyFill can detect sustained changes that may indicate distress and offer contextual support.
        - title: Adaptive Digital Assistant
          text: |-
            When sustained distress is detected, the digital assistant gently signals that it has a suggestion and offers calming guidance and personalized recommendations.

            Users decide whether to open and apply them.
          media:
            - src: show-digital-assitance.jpeg
              alt: Personal details form with the digital assistant icon showing a notification bubble that says it has a small suggestion
            - src: personlized-recommandation.jpeg
              alt: The digital assistant's pop-up suggesting a change of screen colours, with black-and-white and purple night colour options
        - title: Personalized Accessibility
          text: |-
            EasyFill supports voice input through speech-to-text, adjustable text sizes, interface colors, text-to-speech, background sounds, and other accessibility options, allowing users to customize their experience according to their needs.
          media:
            - src: example-implemnt-interface-chage.jpeg
              alt: The form after the purple colour scheme was applied, with the assistant confirming the change and offering a link to the colour settings

    - id: architecture
      title: Technology & Architecture
      text: |-
        EasyFill was developed using Kotlin and Jetpack Compose for Android, with Firebase handling authentication and data storage.

        A Node.js backend hosted on Google Cloud Run connects the application to Azure AI Document Intelligence for document extraction and processing.

        The system also integrates multimodal distress detection and a context-aware digital assistant to provide personalized accessibility recommendations.
      media:
        - src: architecture easyfill.png
          alt: "EasyFill architecture diagram. The mobile app connects to the digital assistant interface, speech-to-text, text-to-speech, the distress-detection modules (Google MediaPipe Face Mesh, Android acoustic analysis, gyroscope and accelerometer) and a Cloud Run function. The function sends documents to Azure AI Document Intelligence; a regex extraction module turns the result into structured form data stored in the Firebase database."
      tools:
        - name: Kotlin
          use: Android application development.
        - name: Jetpack Compose
          use: Declarative Android user interface.
        - name: Firebase
          use: Authentication and data storage.
        - name: Node.js
          use: Backend services and document-processing integration.
        - name: Google Cloud Run
          use: Backend hosting.
        - name: Azure AI Document Intelligence
          use: Information extraction from PDF documents.
        - name: Google MediaPipe
          use: Pre-trained facial landmark detection for facial signal analysis.
        - name: Python & Jupyter Notebook
          use: Distress-detection algorithm experimentation and evaluation.

    - id: demos
      title: Distress Detection Demonstrations
      text: |-
        EasyFill identifies potential signs of distress by comparing live signals against each user's personalized baseline. It integrates signal processing, statistical analysis, rule-based scoring, and ML-powered facial landmark detection.

        The following demonstrations highlight two of its detection channels: hand movement analysis and voice analysis.
      items:
        - title: Hand Distress Detection
          text: Accelerometer and gyroscope data are filtered and analyzed with an FFT to find rhythmic movement in the 6–13 Hz tremor range. Movement that exceeds the user's personal baseline and persists across overlapping time windows produces a hand distress score from 0 to 4.
          media:
            - video: Hand_Distress_Detection_Demo.mp4
              title: Hand Distress Detection demo
              poster: hand-distress-detection-poster.webp
        - title: Voice Distress Detection
          text: Each recording is measured for speaking rate and variation in voice intensity, then compared with the user's baseline and a typical Hebrew speaking rate. Threshold rules turn these deviations into a voice distress score from 0 to 4.
          media:
            - video: Voice_Distress_Detection_Demo.mp4
              title: Voice Distress Detection demo
              poster: voice-distress-detection-poster.webp

    - id: evaluation
      title: Testing & Evaluation
      text: |-
        The multimodal distress-detection algorithms were evaluated in Python and Jupyter Notebook using recorded sessions and synthetic datasets, with performance assessed through accuracy, precision, and confusion-matrix analysis.

        The evaluation code and notebooks are available in a separate repository for further technical exploration.
      links:
        - label: View Evaluation Repository on GitHub
          url: https://github.com/shahar-eliyahu/EasyFill-Testing

visual:
  id: easyfill
  label: EASYFILL
  kicker: PTSD
  headline: Adaptive Support
---
