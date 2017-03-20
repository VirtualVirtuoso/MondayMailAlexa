# Monday Mail Alexa Skill

This little project is my venture into creating Amazon Alexa Skills.

The Monday Mail is a newsletter which is released from the School of Computer Science, from the University of Manchester. 
It's of a very consistent format, and I'm a hater of emails, so this works.

[The Monday Mail can be read here](http://studentnet.cs.manchester.ac.uk/ugt/mondaymail/)
[You can find the SDK for Alexa's Skill kit here](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs)

## Planned Features
**Natural Language**: Currently Alexa will read out the newsletter as it is written, which is not always clear when spoken. I aim to teach Alexa how to properly vocalise certain shorthands. Most of these would be listing common occurences, and mapping them to phrases easier to say.

* "Wed 1st Mar 15:00" would become "Wednesday, the 1st Of March at 15 o'clock"
* "Come for snacks/pizza/other goodies" would become "Come for snacks, pizza and other goodies"
* "Staff student coding comp" would become "Staff student coding competition"

Also, Alexa has the ability to understand markup in the message given to her, so inserting markup for a more natural reading would also be an improvement.

**Interactions**:

Alexa would be able to group articles into which day of the week they occur in, such that the user can ask for events on a given day.

* *"Is there anything happening at the university today?"*
* *"Tell me what is happening this week"*
* *"Is there anything happening on Wednesday?*

**Improve the reliability of the Web-Scraper**:

This Skill works on the assumption that the Monday Mail will never change format. It would be worth investigating if there's a more rigid way of obtaining this data. Perhaps encourage Toby to set up an RSS feed?

## Licence

This project is covered by the MIT licence. In other words, you may do with it what you want, as long as you don't blame
me for anything which breaks on your computer.
