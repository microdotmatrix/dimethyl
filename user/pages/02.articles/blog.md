---
title: Blog
date_modified: '01/18/2022 08:49 pm'
editor: Odin
date: '01/08/2022 05:09 am'
author: Odin
revision: 3
media_order: sg-0025.jpg
child_type: post
hero_image: f3.jpg
content:
    items:
        - '@self.children'
    limit: 5
    order:
        by: date
        dir: desc
    pagination: true
    url_taxonomy_filters: true
all:
   items:
      - '@self.descendants'
   order:
      by: date
      dir: desc
   pagination: true
   url_taxonomy_filters: true
news:
   items:
      - '@page.children': '/articles/news'
   order:
      by: date
      dir: desc
   pagination: true
   url_taxonomy_filters: true
events:
   items:
      - '@page.children': '/articles/events'
   order:
      by: date
      dir: desc
   pagination: true
   url_taxonomy_filters: true
projects:
   items:
      - '@page.children': '/articles/projects'
   order:
      by: date
      dir: desc
   pagination: true
   url_taxonomy_filters: true
---