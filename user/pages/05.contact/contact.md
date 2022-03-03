---
title: Contact
date_modified: '02/23/2022 07:47 am'
editor: Odin
date: '01/08/2022 07:52 pm'
author: Odin
revision: 3
media_order: hayglitch.jpg
form:
    name: contact
    fields:
        name:
            label: Name
            placeholder: 'Enter your name'
            autocomplete: 'on'
            type: text
            validate: null
            required: true
        email:
            label: Email
            placeholder: 'Enter your email address'
            type: email
            validate: null
            required: true
        subject:
            label: Subject
            placeholder: 'Enter your subject'
            type: text
            validate:
                required: true
        message:
            label: Message
            placeholder: 'Enter your message'
            type: textarea
            validate: null
            required: true
        g-recaptcha-response:
            label: Captcha
            type: captcha
            recaptcha_not_validated: 'Captcha not valid!'
    buttons:
        submit:
            type: submit
            value: Submit
        reset:
            type: reset
            value: Reset
    process:
        captcha: false
        save:
            fileprefix: contact-
            dateformat: Ymd-His-u
            extension: txt
            body: '{% include ''forms/data.txt.twig'' %}'
        email:
            subject: '[Site Contact Form] {{ form.value.name|e }}'
            body: '{% include ''forms/data.html.twig'' %}'
        message: 'Thank you for getting in touch!'
        display: thankyou
---

Lorem, ipsum dolor sit amet consectetur adipisicing elit. Itaque ad unde ipsam, minima iste amet, porro magni est hic dignissimos ex inventore delectus laborum! Doloremque praesentium cupiditate culpa neque numquam?