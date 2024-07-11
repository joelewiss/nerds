#include <stddef.h>
#include <stdlib.h>
#include <setjmp.h>
#include <stdarg.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <stdint.h>
#include <signal.h>
#include <getopt.h>
#include <stdbool.h>
#include "list.h"
#include "cmocka.h"

#ifdef _WIN32
// Compatibility with the Windows standard C library.
#define vsnprintf _vsnprintf
#endif /* _WIN32 */

static char big_buffer[1024];

int test_printf(const char *format, ...) CMOCKA_PRINTF_ATTRIBUTE(1, 2);

// A mock printf function that just gathers up the strings printed
// into a big buffer so that they can be checked later.
int test_printf(const char *format, ...) {
	int return_value;
    char temporary_buffer[256];
	va_list args;
	va_start(args, format);
	return_value = vsnprintf(temporary_buffer, sizeof(temporary_buffer),
	                         format, args);
    function_called();
    // Concatenate the temporary buffer to the big buffer.
    strcat(big_buffer, temporary_buffer);
	va_end(args);
	return return_value;
}

/***static void test_list_init(void **state) {
    (void) state;
    node *head = NULL;
    assert_int_equal(list_init(&head), EXIT_SUCCESS);
    assert_null(head);
}***/

static void test_list_add_item_at_pos_empty_list(void **state){
    (void) state;
    node *head = NULL;
    assert_int_equal(list_add_item_at_pos(&head, "item1", 1.0, 1, 1), EXIT_SUCCESS);
    assert_string_equal(head->item_name, "item1");
}

static void test_list_add_item_at_pos_first(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    assert_int_equal(list_add_item_at_pos(&head, "item2", 2.0, 1, 1), EXIT_SUCCESS);
    assert_string_equal(head->item_name, "item2");
}
static void test_list_add_item_at_pos_second_item(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    assert_int_equal(list_add_item_at_pos(&head, "item2", 2.0, 1, 2), EXIT_SUCCESS);
    assert_string_equal(head->next->item_name, "item2");
}

static void test_list_add_item_at_pos_between(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    ref_list_add_item_at_pos(&head, "item2", 2.0, 1, 2);
    assert_int_equal(list_add_item_at_pos(&head, "item1.5", 1.5, 1, 2), EXIT_SUCCESS);
    assert_string_equal(head->next->item_name, "item1.5");
    assert_string_equal(head->next->next->item_name, "item2");
    assert_string_equal(head->item_name, "item1");
}

static void test_list_add_item_at_pos_empty_list_outside_pos(void **state){
    (void) state;
    node *head = NULL;
    assert_int_equal(list_add_item_at_pos(&head, "item1", 1.0, 1, 4), EXIT_FAILURE);

}

static void test_list_add_item_at_pos_null_name(void **state){
    (void) state;
    node *head = NULL;
    assert_int_equal(list_add_item_at_pos(&head, NULL, 1.0, 1, 1), EXIT_FAILURE);
}

static void test_list_add_item_at_pos_zero(void **state){
    (void) state;
    node *head = NULL;
    assert_int_equal(list_add_item_at_pos(&head, "item1", 1.0, 1, 0), EXIT_FAILURE);
}

static void test_list_add_item_at_pos_out_of_bounds(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    assert_int_equal(list_add_item_at_pos(&head, "item1", 1.0, 1, 10), EXIT_FAILURE);
}

static void test_list_upate_item_at_pos_first(void **state){
    (void) state;
    node *head = NULL;
    char *newname = "item3";
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    assert_int_equal(list_update_item_at_pos(&head, newname, 3.0, 2, 1), EXIT_SUCCESS);
    assert_string_equal(head->item_name, newname);
    assert_float_equal(head->price, 3.0, 0.01);
    assert_int_equal(head->quantity, 2);
}

static void test_list_update_item_at_pos_other(void **state){
    (void) state;
    node *head = NULL;
    char *newname = "item3";
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    ref_list_add_item_at_pos(&head, "item2", 1.0, 1, 2);
    assert_int_equal(list_update_item_at_pos(&head, newname, 3.0, 2, 2), EXIT_SUCCESS);
    assert_string_equal(head->next->item_name, newname);
    assert_float_equal(head->next->price, 3.0, 0.01);
    assert_int_equal(head->next->quantity, 2);
}

static void test_list_update_item_at_pos_empty(void **state){
    (void) state;
    node *head = NULL;
    char *newname = "item3";
    assert_int_equal(list_update_item_at_pos(&head, newname, 3.0, 2, 1), EXIT_FAILURE);
}

static void test_list_update_item_at_pos_zero(void **state){
    (void) state;
    node *head = NULL;
    char *newname = "item3";
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    assert_int_equal(list_update_item_at_pos(&head, newname, 3.0, 2, 0), EXIT_FAILURE);
}

static void test_list_update_item_at_pos_out_of_bounds(void **state){
    (void) state;
    node *head = NULL;
    char *newname = "item3";
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    assert_int_equal(list_update_item_at_pos(&head, newname, 3.0, 2, 2), EXIT_FAILURE);
}

static void test_list_update_item_at_pos_null_name(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    assert_int_equal(list_update_item_at_pos(&head, NULL, 3.0, 2, 1), EXIT_FAILURE);
}

static void test_list_remove_item_at_pos_first(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    assert_int_equal(list_remove_item_at_pos(&head, 1), EXIT_SUCCESS);
    assert_null(head);
}

static void test_list_remove_item_at_pos_middle(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    ref_list_add_item_at_pos(&head, "item2", 1.0, 1, 2);
    ref_list_add_item_at_pos(&head, "item3", 1.0, 1, 3);
    assert_int_equal(list_remove_item_at_pos(&head, 2), EXIT_SUCCESS);
    assert_string_equal(head->next->item_name, "item3");
}

static void test_list_remove_item_at_pos_end(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    ref_list_add_item_at_pos(&head, "item2", 1.0, 1, 2);
    ref_list_add_item_at_pos(&head, "item3", 1.0, 1, 3);
    assert_int_equal(list_remove_item_at_pos(&head, 3), EXIT_SUCCESS);
    assert_null(head->next->next);
}

static void test_list_remove_item_at_pos_empty(void **state){
    (void) state;
    node *head = NULL;
    assert_int_equal(list_remove_item_at_pos(&head, 1), EXIT_FAILURE);
}

static void test_list_remove_item_at_pos_out_of_bounds(void **state){
     (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    assert_int_equal(list_remove_item_at_pos(&head, 2), EXIT_FAILURE);
}

static void test_list_remove_item_at_pos_zero(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    assert_int_equal(list_remove_item_at_pos(&head, 0), EXIT_FAILURE);
}

static void test_list_swap_item_positions_adjacent_first(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    ref_list_add_item_at_pos(&head, "item2", 2.0, 1, 2);
    assert_int_equal(list_swap_item_positions(&head, 1, 2), EXIT_SUCCESS);
    assert_string_equal(head->item_name, "item2");
    assert_string_equal(head->next->item_name, "item1");
    assert_int_equal(list_swap_item_positions(&head, 1, 2), EXIT_SUCCESS);
}

static void test_list_swap_item_positions_apart_first(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    ref_list_add_item_at_pos(&head, "item2", 2.0, 1, 2);
    ref_list_add_item_at_pos(&head, "item3", 2.0, 1, 3);
    assert_int_equal(list_swap_item_positions(&head, 1, 3), EXIT_SUCCESS);
    assert_string_equal(head->item_name, "item3");
    assert_string_equal(head->next->next->item_name, "item1");
    assert_int_equal(list_swap_item_positions(&head, 1, 3), EXIT_SUCCESS);
}

static void test_list_swap_item_positions_adjacent_other(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    ref_list_add_item_at_pos(&head, "item2", 2.0, 1, 2);
    ref_list_add_item_at_pos(&head, "item3", 2.0, 1, 3);
    ref_list_add_item_at_pos(&head, "item4", 2.0, 1, 4);
    ref_list_add_item_at_pos(&head, "item5", 2.0, 1, 5);
    assert_int_equal(list_swap_item_positions(&head, 3, 2), EXIT_SUCCESS);
    assert_string_equal(head->next->item_name, "item3");
    assert_string_equal(head->next->next->item_name, "item2");
}

static void test_list_swap_item_positions_apart_other(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    ref_list_add_item_at_pos(&head, "item2", 2.0, 1, 2);
    ref_list_add_item_at_pos(&head, "item3", 2.0, 1, 3);
    ref_list_add_item_at_pos(&head, "item4", 2.0, 1, 4);
    ref_list_add_item_at_pos(&head, "item5", 2.0, 1, 5);
    assert_int_equal(list_swap_item_positions(&head, 4, 2), EXIT_SUCCESS);
    assert_string_equal(head->next->item_name, "item4");
    assert_string_equal(head->next->next->next->item_name, "item2");
}

static void test_list_swap_item_positions_empty(void **state){
    (void) state;
    node *head = NULL;
    assert_int_equal(list_swap_item_positions(&head, 1, 2), EXIT_FAILURE);
}

static void test_list_swap_item_positions_zero(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    ref_list_add_item_at_pos(&head, "item2", 2.0, 1, 2);
    assert_int_equal(list_swap_item_positions(&head, 1, 0), EXIT_FAILURE);
    assert_int_equal(list_swap_item_positions(&head, 0, 1), EXIT_FAILURE);
}

static void test_list_swap_item_positions_out_of_bounds(void **state){
    (void) state;
    node *head = NULL;
    ref_list_add_item_at_pos(&head, "item1", 1.0, 1, 1);
    ref_list_add_item_at_pos(&head, "item2", 2.0, 1, 2);
    assert_int_equal(list_swap_item_positions(&head, 1, 10), EXIT_FAILURE);
    assert_int_equal(list_swap_item_positions(&head, 9, 1), EXIT_FAILURE);
}

int ref_list_add_item_at_pos(node **head, char *item_name, float price, int quantity, unsigned int pos)
{
    if (*head == NULL && pos > 1){
        return EXIT_FAILURE;
    }
    if (pos < 1){
        return EXIT_FAILURE;
    }
    //include check for pos exisiting
    int i = 0;
    node *curr = *head;
    node *prev = *head;
    node *new = malloc(sizeof(node));
    if (new == NULL) {
        return EXIT_FAILURE;
    }
    new->price = price;
    if (item_name == NULL){
        free(new);
        return EXIT_FAILURE;
    }
    new -> item_name = malloc(strlen(item_name) + 1);
    strncpy(new->item_name, item_name, strlen(item_name));
    new->quantity = quantity;
    new -> next = NULL;
    if (pos == 1){
        if (head == NULL){
            *head = new;
        }
        else{
            new->next = *head;
            *head = new;
        }
    }
    else{
        while(i < pos - 1 && curr!=NULL){
            prev = curr;
            curr = curr->next;
            i++;
        }

        new -> next = curr;
        prev -> next = new;
    }

    return EXIT_SUCCESS;
}
int main(int argc, char *argv[]) {
    int function_flag = 0;
    int sec_flag = 0;
    if (argc > 1){
        function_flag = atoi(argv[1]);
        sec_flag = atoi(argv[2]);
    }
    /**const struct CMUnitTest init_tests[] = {
        cmocka_unit_test(test_list_init),
    };**/

    const struct CMUnitTest add_item_tests[] = {
        cmocka_unit_test(test_list_add_item_at_pos_zero),
        cmocka_unit_test(test_list_add_item_at_pos_empty_list),
        cmocka_unit_test(test_list_add_item_at_pos_first),
        cmocka_unit_test(test_list_add_item_at_pos_second_item),
        cmocka_unit_test(test_list_add_item_at_pos_between),
    };
    const struct CMUnitTest add_item_sec_tests[] = {
        cmocka_unit_test(test_list_add_item_at_pos_empty_list_outside_pos),
        cmocka_unit_test(test_list_add_item_at_pos_null_name),
        cmocka_unit_test(test_list_add_item_at_pos_out_of_bounds),
    };

    const struct CMUnitTest update_item_tests[] = {
        cmocka_unit_test(test_list_update_item_at_pos_zero),
        cmocka_unit_test(test_list_upate_item_at_pos_first),
        cmocka_unit_test(test_list_update_item_at_pos_other),
    };

    const struct CMUnitTest update_item_sec_tests[] = {
        cmocka_unit_test(test_list_update_item_at_pos_empty),
        cmocka_unit_test(test_list_update_item_at_pos_null_name),
        cmocka_unit_test(test_list_update_item_at_pos_out_of_bounds),
    };

    const struct CMUnitTest remove_item_tests[] = {
        /*cmocka_unit_test(test_list_remove_item_at_pos_zero),
        cmocka_unit_test(test_list_remove_item_at_pos_first),*/
        cmocka_unit_test(test_list_remove_item_at_pos_middle),
        cmocka_unit_test(test_list_remove_item_at_pos_end)
    };

    const struct CMUnitTest remove_item_sec_tests[] = {
        cmocka_unit_test(test_list_remove_item_at_pos_empty),
        cmocka_unit_test(test_list_remove_item_at_pos_out_of_bounds),
    };

    const struct CMUnitTest swap_item_tests[] = {
        cmocka_unit_test(test_list_swap_item_positions_zero),
        cmocka_unit_test(test_list_swap_item_positions_adjacent_first),
        cmocka_unit_test(test_list_swap_item_positions_apart_first),
        cmocka_unit_test(test_list_swap_item_positions_adjacent_other),
        cmocka_unit_test(test_list_swap_item_positions_apart_other),
    };

    const struct CMUnitTest swap_item_sec_tests[] = {
        cmocka_unit_test(test_list_swap_item_positions_empty),
        cmocka_unit_test(test_list_swap_item_positions_out_of_bounds),
    };
    switch(function_flag) {
        case 1:
            if (sec_flag == 1){
                /**printf("Testing init\n");
                cmocka_run_group_tests(init_tests, NULL, NULL);**/
                printf("Testing add item\n");
                printf("-----------------------------------\n");
	            cmocka_run_group_tests(add_item_tests, NULL, NULL);
                printf("\nTesting add item security\n");
                printf("-----------------------------------\n");
                return cmocka_run_group_tests(add_item_sec_tests, NULL, NULL);
            }
            /**printf("Testing init\n");
            printf("-----------------------------------\n");
            cmocka_run_group_tests(init_tests, NULL, NULL);**/
            printf("Testing add item\n");
            printf("-----------------------------------\n");
	        return cmocka_run_group_tests(add_item_tests, NULL, NULL);
        case 2:
            if (sec_flag == 1){
                printf("\nTesting update item\n");
                printf("-----------------------------------\n");
	            cmocka_run_group_tests(update_item_tests, NULL, NULL);
                printf("\nTesting update item security\n");
                printf("-----------------------------------\n");
                return cmocka_run_group_tests(update_item_sec_tests, NULL, NULL);
            }
            printf("\nTesting update item\n");
            printf("-----------------------------------\n");
	        return cmocka_run_group_tests(update_item_tests, NULL, NULL);
        case 3:
            if (sec_flag == 1){
                printf("\nTesting remove item\n");
                printf("-----------------------------------\n");
	            cmocka_run_group_tests(remove_item_tests, NULL, NULL);
                printf("\nTesting remove item security\n");
                printf("-----------------------------------\n");
                return cmocka_run_group_tests(remove_item_sec_tests, NULL, NULL);
            }
            printf("\nTesting remove item\n");
            printf("-----------------------------------\n");
	        return cmocka_run_group_tests(remove_item_tests, NULL, NULL);
        case 4:
            if (sec_flag == 1){
                printf("\nTesting swap items\n");
                printf("-----------------------------------\n");
	            cmocka_run_group_tests(swap_item_tests, NULL, NULL);
                printf("\nTesting swap items security\n");
                printf("-----------------------------------\n");
	            return cmocka_run_group_tests(swap_item_sec_tests, NULL, NULL);
            }
            printf("\nTesting swap items\n");
            printf("-----------------------------------\n");
	        return cmocka_run_group_tests(swap_item_tests, NULL, NULL);
        default:
            /**printf("Testing init\n");
            printf("-----------------------------------\n");
            cmocka_run_group_tests(init_tests, NULL, NULL);**/
            printf("Testing add item\n");
            printf("-----------------------------------\n");
	        cmocka_run_group_tests(add_item_tests, NULL, NULL);
            printf("\nTesting add item security\n");
            printf("-----------------------------------\n");
            cmocka_run_group_tests(add_item_sec_tests, NULL, NULL);
            printf("\nTesting update item\n");
            printf("-----------------------------------\n");
	        cmocka_run_group_tests(update_item_tests, NULL, NULL);
            printf("\nTesting update item security\n");
            printf("-----------------------------------\n");
            cmocka_run_group_tests(update_item_sec_tests, NULL, NULL);
            printf("\nTesting remove item\n");
            printf("-----------------------------------\n");
	        cmocka_run_group_tests(remove_item_tests, NULL, NULL);
            printf("\nTesting remove item security\n");
            printf("-----------------------------------\n");
            cmocka_run_group_tests(remove_item_sec_tests, NULL, NULL);
            printf("\nTesting swap items\n");
            printf("-----------------------------------\n");
	        cmocka_run_group_tests(swap_item_tests, NULL, NULL);
            printf("\nTesting swap items security\n");
            printf("-----------------------------------\n");
	        return cmocka_run_group_tests(swap_item_sec_tests, NULL, NULL);  
    }
}
