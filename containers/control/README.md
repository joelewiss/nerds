# Developer Observatory Control Container

Things I'd like this container (service?) to do:
- Perform control tasks every 5 seconds.
  - Check for old containers and report them to redis
  - Report statistics to stats container

- Control and monitor study
  - Starting and stopping study
  - Review responses
  - Review statistics

- Generate and change Task Files
  - Host the task generator
  - May need to transfer endpoints from submit container


This can probably be done in one big Flask app. But should it?
