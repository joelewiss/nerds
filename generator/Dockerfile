FROM python:3
ARG uid=1000

RUN useradd user -u $uid -Um --shell=/usr/bin/nologin

USER user
WORKDIR /home/user/
COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY --chown=user:user . .
RUN mkdir -p tmp

CMD ["python", "./notebookgen.py"]
