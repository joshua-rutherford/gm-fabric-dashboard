{
  graphiteHost: "127.0.0.1",
  graphitePort: 2003,
  servers: [
    {
      address: "0.0.0.0",
      port: "8125",
      server: "./servers/tcp",
    },
    {
      address: "0.0.0.0",
      port: "8125",
      server: "./servers/udp",
    }
  ],
  flushInterval: 10000
}
