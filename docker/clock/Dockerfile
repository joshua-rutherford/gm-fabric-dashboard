FROM lyft/envoy-alpine:latest

MAINTAINER Decipher Technology Studios <engineeringd@deciphernow.com>

RUN apk --no-cache add \
    ruby \
    ruby-json \
    supervisor

RUN gem install --no-ri --no-rdoc sinatra

COPY etc/envoy /etc/envoy
COPY etc/supervisor.d /etc/supervisor.d
COPY usr/local/bin/clock /usr/local/bin/clock

CMD ["supervisord", "-n"]
