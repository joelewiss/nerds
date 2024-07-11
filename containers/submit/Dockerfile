FROM python:3.8

RUN useradd user -u 1000 -Um --shell=/usr/bin/nologin
USER user

WORKDIR /home/user/app
RUN pip install SQLAlchemy Flask-SQLAlchemy psycopg2 pygments

COPY --chown=user:user submit.py main.py
COPY --chown=user:user configSubmit.py .
COPY --chown=user:user tasks/ ./tasks/

CMD ["python3", "/home/user/app/main.py"]
