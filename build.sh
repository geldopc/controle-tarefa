#!/bin/bash
## npm install enhanced-resolve@3.3.0 (caso ERROR in ./src/main.ts Module not found: Error: Can't resolve './$$_gendir/app/app.module.ngfactory')
### Compilação desenvolvimento: ng serve --project=gsm2
clear
if [ ${1} == 'sitesm-angular' ]; then
  if [ $# -gt 1 ]; then
    if [ ${2} == 'prod' ]; then
      echo 'mod_prod'
      ng build sitesm-angular --prod --aot=true ;
      ssh marcelio_suporte@192.168.20.102 "sudo find /var/tomcat/webapps/novosite/** -type f ! -name 'arquivos' -exec rm -rf {} +;"
      ssh marcelio_suporte@192.168.20.102 "rm -rf /var/tomcat/webapps/novosite/assets"
      rsync -avzh --delete-before dist/sitesm-angular/* -e ssh  marcelio_suporte@192.168.20.102:/var/tomcat7/webapps/novosite/ ;
    fi
  else
      ng build sitesm-angular ;
      ssh marcelio_suporte@192.168.20.102 "rm -f /var/tomcat/webapps/novosite/*"
      rsync -avzh --delete-before dist/sitesm-angular/* -e ssh  marcelio_suporte@192.168.20.102:/var/tomcat7/webapps/novosite/ ;
  fi
elif [ ${1} == 'gsm' ]; then
  if [ ${2} == 'prod' ]; then
    echo 'mod_prod'
    ng build --project=gsm2 --prod --aot=true ;
  else
    ng build gsm2 ;
  fi
#   ssh marcelio_suporte@192.168.20.102 "sudo find /var/tomcat/webapps/gsm/** -type f ! -name 'arquivos' -exec rm -rf {} +;"
        rm -rf ~/Documentos/workspace/gsm-fontes-patch-desenvolvimento-gsm-2018-09-21/src/main/webapp/assets
		rm -rf ~/Documentos/workspace/gsm-fontes-patch-desenvolvimento-gsm-2018-09-21/src/main/webapp/*.js
		rm -rf ~/Documentos/workspace/gsm-fontes-patch-desenvolvimento-gsm-2018-09-21/src/main/webapp/*.html
		rm -rf ~/Documentos/workspace/gsm-fontes-patch-desenvolvimento-gsm-2018-09-21/src/main/webapp/*.map
		rm -rf ~/Documentos/workspace/gsm-fontes-patch-desenvolvimento-gsm-2018-09-21/src/main/webapp/*.eot
		rm -rf ~/Documentos/workspace/gsm-fontes-patch-desenvolvimento-gsm-2018-09-21/src/main/webapp/*.css
		rm -rf ~/Documentos/workspace/gsm-fontes-patch-desenvolvimento-gsm-2018-09-21/src/main/webapp/*.txt
		rm -rf ~/Documentos/workspace/gsm-fontes-patch-desenvolvimento-gsm-2018-09-21/src/main/webapp/*.json
  rsync -avzh --delete-before dist/${1}/* -e ssh ~/Documentos/workspace/gsm-fontes-patch-desenvolvimento-gsm-2018-09-21/src/main/webapp/ ;
fi
