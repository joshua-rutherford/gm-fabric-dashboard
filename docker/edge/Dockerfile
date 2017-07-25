FROM lyft/envoy:latest

COPY etc/envoy/envoy.json /etc/envoy/envoy.json

CMD ["envoy", "-c", "/etc/envoy/envoy.json", "--service-cluster", "edge"]
