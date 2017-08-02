FROM alpine:3.6

COPY etc/apk/repositories /etc/apk/repositories

RUN apk --no-cache add \
    cairo \
    gcc \
    git \
    musl-dev \
    nginx \
    libffi-dev \
    nodejs \
    py2-pip \
    python2-dev \
    supervisor

RUN pip install \
    certifi==2017.7.27.1

RUN pip install \
    carbon==1.0.2 \
    graphite-web==1.0.2 \
    gunicorn==19.7 \
    whisper==1.0.2

COPY etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY etc/nginx/conf.d/graphite.conf /etc/nginx/conf.d/graphite.conf

COPY opt/graphite/conf/carbon.conf /opt/graphite/conf/carbon.conf
COPY opt/graphite/conf/storage-schemas.conf /opt/graphite/conf/storage-schemas.conf

COPY opt/graphite/webapp/graphite/local_settings.py /opt/graphite/webapp/graphite/local_settings.py
RUN PYTHONPATH=/opt/graphite/webapp django-admin.py migrate --settings=graphite.settings --run-syncdb
RUN PYTHONPATH=/opt/graphite/webapp django-admin.py collectstatic --settings=graphite.settings --no-input

RUN git clone https://github.com/etsy/statsd.git /opt/statsd && \
    cd /opt/statsd && \
    git checkout v0.8.0
COPY opt/statsd/config.js /opt/statsd/config.js

COPY etc/supervisor.d /etc/supervisor.d

CMD ["supervisord", "-n"]
