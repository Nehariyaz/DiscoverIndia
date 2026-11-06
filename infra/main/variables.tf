variable "region" {
  type    = string
  default = "eu-north-1"
}

variable "project" {
  type    = string
  default = "discoverindia"
}

variable "frontend_url" {
  type = string
}

variable "gmail_user" {
  type = string
}

variable "db_uri" {
  type      = string
  sensitive = true
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "recaptcha_secret_key" {
  type      = string
  sensitive = true
}

variable "gmail_pass" {
  type      = string
  sensitive = true
}
