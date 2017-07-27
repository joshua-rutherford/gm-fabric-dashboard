FROM lyft/envoy:latest

CMD ["/usr/local/bin/envoy", "--config-path", "/etc/envoy.json", "--service-cluster", "edge", "--service-node", "0", "--log-level", "debug"]
