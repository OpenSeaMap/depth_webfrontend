FROM debian:latest
ARG UID=1001
ARG GID=1001

RUN apt-get -y update && apt-get -y --no-install-recommends upgrade
RUN apt-get -y --no-install-recommends install npm python3 python-is-python3
RUN npm i -g google-closure-compiler handlebars@1.0.12

RUN addgroup --gid $GID builduser && adduser --uid $UID --gid $GID --disabled-password builduser

USER builduser
WORKDIR /depth

CMD /bin/bash -c "./waf configure && ./waf build_release && ./waf install_release"
