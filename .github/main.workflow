workflow "Deploy" {
  on = "push"
  resolves = ["Run deploy script"]
}

action "Run deploy script" {
  uses = "vitalyliber/dokku-github-action@master"
  env = {
      HOST = "casply.com",
      PROJECT = "casply",
    }
  secrets = [
    "PRIVATE_KEY",
    "PUBLIC_KEY",
  ]
}
