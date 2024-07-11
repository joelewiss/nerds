#ifndef LIST_H
#define LIST_H

// Node of the singly linked list
typedef struct _node {
    char* item_name;
    float price;
    int quantity;
    struct _node *next;
} node;

///////////////////////////////////////////////////////////////////////////////
//
// Interface of the singly linked list
//
///////////////////////////////////////////////////////////////////////////////

// Note: All list_ functions should return a status code
// EXIT_FAILURE or EXIT_SUCCESS to indicate whether the operation was successful or not.

// create a new list
int list_init(node **head);

// add a new item (name, price, quantity) to the list at position pos, 
//   such that the added item is the item at position pos
// For example:
// If the list is:
// 1: 3 * banana @ $1.00 ea
// 2: 2 * orange @ $2.00 ea
// and you call list_add_item_at_pos(&head, "apple", 3.0, 4, 2)
// the list should be:
// 1: 3 * banana @ $1.00 ea
// 2: 4 * apple @ $3.00 ea
// 3: 2 * orange @ $2.00 ea
int list_add_item_at_pos(node **head, char *item_name, float price, int quantity, unsigned int pos);

// update the item at position pos
int list_update_item_at_pos(node **head, char *item_name, float price, int quantity, unsigned int pos);

// remove the item at position *pos*
int list_remove_item_at_pos(node **head, int pos);

// swap the item at position pos1 with the item at position pos2
int list_swap_item_positions(node **head, int pos1, int pos2);

int ref_list_add_item_at_pos(node **head, char *item_name, float price, int quantity, unsigned int pos);

#endif




