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

.PHONY: build_app
build_app:
	docker build . -t django_app --no-cache

.PHONY: serve
serve:
	docker compose up

define display_cmd
	@$(PRINT_COLOR) "\n$(COLOR_SUCCESS) ########################## $(COLOR_RESET)\n"
	@$(PRINT_COLOR) "$(COLOR_SUCCESS) ### $(1) $(COLOR_RESET)\n"
	@$(PRINT_COLOR) "$(COLOR_SUCCESS) ########################## $(COLOR_RESET)\n\n"
endef
