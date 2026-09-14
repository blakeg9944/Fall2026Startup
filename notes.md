# CS 260 Notes

This file represents what I have learned about web programming.

- [My startup](https://startup.cs260.click)
- [My simon](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

Interesting things I have learned about AWS

- Created an EC2 instance in us-east-1 (N. Virginia) using the class AMI (ami-094c4a0be0b642a24), instance type t3.micro.
- Server public IP (Elastic IP, won't change): `100.52.68.14`
- Public DNS: `ec2-100-52-68-14.compute-1.amazonaws.com`
- SSH into the server with: `ssh -i [path to key pair file] ubuntu@100.52.68.14`
  - If you get a permissions warning on the key file, fix it with `chmod 600 [key pair file]`
- Assigned an Elastic IP so the public IP stays the same even after stopping/restarting the instance. Remember to release it later if it's no longer needed, since it costs money while unattached to a running instance.
- Security group (`launch-wizard-1`) needs inbound rules for SSH (22), HTTP (80), and HTTPS (443), all open to 0.0.0.0/0 — by default only SSH may get added if you click through the wizard too fast, and the page won't load until HTTP/HTTPS are added too.
- Test the server by visiting `http://100.52.68.14` in the browser — use plain http, not https, until Caddy/TLS is configured.

## HTML

Interesting things I have learned about HTML

## React

Interesting things I have learned about React

I love web programming