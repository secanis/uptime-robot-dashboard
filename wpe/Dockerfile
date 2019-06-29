FROM petrosagg/balena-wpe:raspberrypi3-968d2af

COPY wpe-init /wpe-init
RUN chmod +x /wpe-init

CMD [ "sh", "/wpe-init" ]

ENV TOHORA_VERSION=0.3.2
RUN wget -O tohora.tgz \
    "https://github.com/mozz100/tohora/releases/download/v"$TOHORA_VERSION"/tohora_"$TOHORA_VERSION"_Linux_armv5.tar.gz" \
    && tar xzf tohora.tgz \
    && rm tohora.tgz