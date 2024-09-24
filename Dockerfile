FROM debian:latest

RUN apt -y update && apt -y --no-install-recommends upgrade
RUN apt -y --no-install-recommends install npm python3 python-is-python3
RUN npm i -g google-closure-compiler handlebars@1.0.12

RUN adduser --disabled-password -uid 1000 build

VOLUME [ "/depth" ]
RUN mkdir /depth

VOLUME [ "/release" ]
RUN mkdir /release

RUN chown -R build /depth /release

USER build
WORKDIR /depth

CMD /bin/bash -c "cd /depth && ./waf configure && ./waf build_release && ./waf install_release"
