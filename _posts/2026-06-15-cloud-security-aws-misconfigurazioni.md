---
layout: post
title: "Cloud Security: le misconfigurazioni AWS più comuni e come evitarle"
date: 2026-06-15
cat: blue
tags: [AWS, cloud security, S3, IAM, misconfigurazioni, CSPM, sicurezza cloud]
excerpt: "Il 99% delle violazioni cloud è causato da errori di configurazione, non da vulnerabilità del provider. Bucket S3 pubblici, IAM permissivo, istanze EC2 esposte: le misconfigurazioni AWS più comuni e come correggerle."
---

"Il cloud è sicuro" — il provider sì, ma la responsabilità della configurazione è tua. Il modello **Shared Responsibility** di AWS chiarisce: Amazon protegge l'infrastruttura, tu proteggi ciò che ci metti sopra. La maggior parte delle violazioni cloud non è colpa di AWS.

## Il modello Shared Responsibility

```
AWS responsabile di:          Tu responsabile di:
├─ Datacenter fisici          ├─ Configurazione S3 (pubblico/privato)
├─ Hardware                   ├─ Permessi IAM
├─ Hypervisor                 ├─ Firewall (Security Groups)
├─ Servizi managed            ├─ Cifratura dei dati
└─ Rete fisica                └─ Patch del SO nelle EC2
```

## S3: bucket pubblici — la misconfiguration più comune

Ogni breach da "database esposto su S3" è evitabile. Le cause principali:

```bash
# Verifica se un bucket è pubblico
aws s3api get-bucket-acl --bucket nome-bucket
aws s3api get-bucket-policy --bucket nome-bucket

# Forza il blocco dell'accesso pubblico
aws s3api put-public-access-block \
  --bucket nome-bucket \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

**Buona pratica**: abilita "S3 Block Public Access" a livello di account, non solo sui singoli bucket.

## IAM: il principio del least privilege

Il 73% delle organizzazioni ha almeno un account con AdministratorAccess che non lo dovrebbe avere. Problemi comuni:

- **Wildcard permissions**: `"Action": "*"` o `"Resource": "*"`
- **Access key senza scadenza** nelle applicazioni
- **Root account usato quotidianamente** invece di un account IAM amministratore
- **Assenza di MFA** sugli account privilegiati

```json
// ❌ Pericoloso
{
  "Effect": "Allow",
  "Action": "*",
  "Resource": "*"
}

// ✓ Corretto: solo le azioni necessarie sulla risorsa specifica
{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::nome-bucket/*"
}
```

## Security Groups: porte aperte al mondo

I Security Group sono i firewall delle EC2. Configurazioni pericolose:

```
0.0.0.0/0 → porta 22 (SSH aperto a tutto il mondo)
0.0.0.0/0 → porta 3389 (RDP aperto)
0.0.0.0/0 → porta 3306 (MySQL esposto)
```

**Soluzione**: SSH e RDP solo da IP specifici o tramite AWS Systems Manager Session Manager (senza SSH esposto).

## CloudTrail: log di tutto

CloudTrail registra ogni chiamata API in AWS. È il log di audit fondamentale:

```bash
# Abilita CloudTrail su tutti i servizi e tutte le regioni
aws cloudtrail create-trail \
  --name main-trail \
  --s3-bucket-name my-cloudtrail-bucket \
  --is-multi-region-trail \
  --include-global-service-events

# Alert su login di root
aws cloudwatch put-metric-alarm \
  --alarm-name root-login-alert \
  --metric-name RootAccountUsage ...
```

## Strumenti di valutazione

- **AWS Security Hub**: aggregatore nativo, include CIS AWS Benchmark
- **AWS Config**: monitora le configurazioni e avvisa sulle deviazioni
- **Scout Suite**: audit open source multi-cloud
- **Prowler**: CIS benchmark e best practice AWS, open source
- **Checkov**: analisi IaC (Terraform, CloudFormation) per errori di sicurezza

## CIS AWS Foundations Benchmark

Il Center for Internet Security pubblica un benchmark con 50+ controlli per AWS. Punti chiave:
- MFA su root e su tutti gli IAM admin
- Nessuna access key per root
- CloudTrail attivo in tutte le regioni
- Nessun security group con 0.0.0.0/0 su porte sensibili
- Cifratura di tutti i bucket S3 e volumi EBS
