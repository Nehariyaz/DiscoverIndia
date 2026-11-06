DiscoverIndia - Terraform starter (run from the project root)

BEFORE ANYTHING
1. In backend\index.js line 6, change:  require('bcrypt')  ->  require('bcryptjs')
2. cd backend ; npm uninstall bcrypt ; cd ..
3. Add these lines to .gitignore:
     .terraform/
     *.tfstate
     *.tfstate.*
     *.tfvars
     infra/main/build/

PHASE 1 - state bucket (about 2 minutes)
  cd infra\bootstrap
  terraform init
  terraform apply          (type yes)
  cd ..\..

PHASE 2 - backend (Lambda + API)
  copy infra\main\terraform.tfvars.example infra\main\terraform.tfvars
  (open terraform.tfvars and fill in your NEW values)
  powershell -ExecutionPolicy Bypass -File infra\main\build.ps1
  cd infra\main
  $b = terraform -chdir=..\bootstrap output -raw state_bucket
  terraform init -backend-config="bucket=$b"
  terraform plan
  terraform apply          (type yes)
  curl.exe -i "<api_url>/api/destinations"

TO STOP EVERYTHING IN PHASE 2 (no more charges from it)
  cd infra\main
  terraform destroy
