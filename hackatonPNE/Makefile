###########################
#          colors         #
###########################
PRINT_COLOR = printf
COLOR_SUCCESS = \033[1;32m
COLOR_DEBUG = \033[36m
COLOR_RESET = \033[0m

###########################
#        Variables        #
###########################

DIR_BIN = .venv/bin/

-include Makefile.local

###########################
#           DB            #
###########################

.PHONY: launchdb
launchdb:
	docker compose up

.PHONY: install_req
install_req:
	python3 -m venv .venv
	. .venv/bin/activate && pip install -r requirements.txt

.PHONY: serve
serve: install_req
	python manage.py runserver

define display_cmd
	@$(PRINT_COLOR) "\n$(COLOR_SUCCESS) ########################## $(COLOR_RESET)\n"
	@$(PRINT_COLOR) "$(COLOR_SUCCESS) ### $(1) $(COLOR_RESET)\n"
	@$(PRINT_COLOR) "$(COLOR_SUCCESS) ########################## $(COLOR_RESET)\n\n"
endef
