# Script to renew certificates

## Using Certbot :

Even though Let’s Encrypt cannot issue certificates for `formation.local`, this script shows how a standard Certbot renewal works.

```bash
#!/bin/bash

LOGFILE="/var/log/cert_renew.log"

{
    echo "Running certbot renew on $(date)"
    certbot renew
    echo "Done at $(date)"
} >> "$LOGFILE" 2>&1
```

---

## Using Local Self-Signed Certificate :

> Simulates Let's Encrypt behavior (certificates last 90 days)

```bash
#!/bin/bash

set -e

DOMAIN="formation.local"
CERT_DIR="/etc/letsencrypt/live/$DOMAIN"
TMP_DIR="/tmp/$DOMAIN-cert"

LOG_FILE="/var/log/renew-formation-cert.log"

mkdir -p "$TMP_DIR"
mkdir -p "$CERT_DIR"

echo "[$(date)] Starting certificate renewal for $DOMAIN" >> "$LOG_FILE"

# Generate new self-signed certificate
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout "$TMP_DIR/privkey.pem" \
  -out "$TMP_DIR/fullchain.pem" \
  -subj "/CN=$DOMAIN" >> "$LOG_FILE" 2>&1

# Replace old certificates atomically
mv -f "$TMP_DIR/privkey.pem" "$CERT_DIR/privkey.pem"
mv -f "$TMP_DIR/fullchain.pem" "$CERT_DIR/fullchain.pem"

# Set permissions
chmod 600 "$CERT_DIR/privkey.pem"
chmod 644 "$CERT_DIR/fullchain.pem"

# Cleanup temporary folder
rm -rf "$TMP_DIR"

echo "[$(date)] Renewal complete. Restarting nginx container..." >> "$LOG_FILE"

# Restart NGINX container (adapt name if needed)
docker compose restart nginx >> "$LOG_FILE" 2>&1

echo "[$(date)] Done." >> "$LOG_FILE"
```

---

## Cron Job - Renewal

Edit root’s crontab:

```bash
sudo crontab -e
```

Add:

```bash
# Renew self-signed certificate every 90 days at 03:00
0 3 */90 * * /usr/local/bin/renew-formation-cert.sh >> /var/log/renew-formation-cert.log 2>&1
```

---

## Testing the HTTPS API

Since the certificate is self-signed:

```bash
curl -k https://formation.local/api/health
```

The `-k` option accepts the non-trusted certificate.
