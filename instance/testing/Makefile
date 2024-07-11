CFLAGS=-I. -Icmocka/include -g
LINKER_FLAGS=-sEXIT_RUNTIME=1 -sWASM=1 -sSAFE_HEAP=0 -sASSERTIONS=2 -sSTRICT -sENVIRONMENT=web -sAUTO_JS_LIBRARIES=0 -sAUTO_NATIVE_LIBRARIES=0 -sMALLOC=dlmalloc -sCHECK_NULL_WRITES=1 -sSTACK_OVERFLOW_CHECK=2 -sINCOMING_MODULE_JS_API=[print,printErr,arguments,onAbort,onExit] -fsanitize=undefined -fsanitize-minimal-runtime -fno-sanitize-recover=all
EMCC_COMPILER_FLAGS=-fsanitize=undefined -fno-sanitize-recover=all -fsanitize-minimal-runtime
DEPS=list.h

%.o: %.c $(DEPS)
ifeq ($(CC),emcc)
	$(CC) -c -o $@ $< $(CFLAGS) $(EMCC_COMPILER_FLAGS)
else
	$(CC) -c -o $@ $< $(CFLAGS)
endif

test_task%.o: task%.c $(DEPS)
ifeq ($(CC),emcc)
	$(CC) -DUNIT_TESTING -c -o $@ $< $(CFLAGS) $(EMCC_COMPILER_FLAGS)
else
	$(CC) -DUNIT_TESTING -c -o $@ $< $(CFLAGS)
endif

test_task%: test_task%.o runtests.o cmocka/cmocka.o
	$(CC) -o $@ $^ $(CFLAGS)

test_task%.js: test_task%.o runtests.o cmocka/cmocka.o
	emcc -o $@ $^ $(CFLAGS) $(LINKER_FLAGS) --pre-js pre.js


.PRECIOUS: %.o

.SUFFIXES:

all: cmocka/cmocka.o runtests.o

.PHONY: clean
clean:
	rm -f *.o cmocka/*.o *.js *.wasm test_task*
