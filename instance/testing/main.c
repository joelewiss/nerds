#include <stdio.h> 
#include <stdlib.h>
#include <getopt.h>
#include <stdbool.h>

#include "list.h"

#define MAX_FILENAME_LEN 100
#define MAX_ITEM_NAME_LEN 48

void print_help()
{
    printf("Choose a letter from the following OPTIONS:\n");
    printf("  a, --Add\t\tAdd a list item (name, price, and quantity) to the list at a given position.\n");
    printf("  r, --Remove\t\tRemove an item from the list at a given position.\n");
    printf("  u, --Update\t\tUpdate a list item (name, price, and quantity) at a given position.\n");
    printf("  c, --Cost\t\tSum the total cost (sum of quantity * price) of the list.\n");

    printf("  s, --Swap\t\tSwap two items by position.\n");
    printf("  f, --Find\t\tFind the item position with the highest individual price.\n");
    printf("  e, --dEduplicate\tDe-duplicate the list by combining items with the same name by adding their quantities.\n");

    printf("  l, --Load\t\tLoad the list from a file.\n");
    printf("  v, --saVe\t\tSave the list to a file.\n");

    printf("  p, --Print\t\tPrint the list.\n");

    printf("  h, --Help\t\tPrint this help message.\n");     
    printf("  q, --Quit\t\tQuit the program.\n");   

}

int parse_input(char opt, node** list)
{
    char filename[MAX_FILENAME_LEN];

    char temp_item_name[MAX_ITEM_NAME_LEN];
    float temp_price;
    int temp_quantity;
    unsigned int temp_pos;
    unsigned int temp_pos_b;

    switch(opt)
    {
        case 'a':
            printf("Position of item to add?\n");
            scanf("%u", &temp_pos);
            printf("Name of item to add?\n");
            scanf("%s", temp_item_name);
            printf("Price of item to add?\n");
            scanf("%f", &temp_price);
            printf("Quantity of item to add?\n");
            scanf("%d", &temp_quantity);

            if(list_add_item_at_pos(list, temp_item_name, temp_price, temp_quantity, temp_pos) == 0) {
                printf("OK.\n");
            } else {
                printf("Error.\n");
            }
            break;

        case 'r':
            printf("Position of item to remove?\n");
            scanf("%u", &temp_pos);

            if(list_remove_item_at_pos(list, temp_pos) == 0) {
                printf("OK.\n");
            } else {
                printf("Error.\n");
            }
            break;

        case 'u':
            printf("Position of item to update?\n");
            scanf("%u", &temp_pos);
            printf("New item name?\n");
            scanf("%s", temp_item_name);
            printf("New item price?\n");
            scanf("%f", &temp_price);
            printf("New item quantity?\n");
            scanf("%d", &temp_quantity);

            if(list_update_item_at_pos(list, temp_item_name, temp_price, temp_quantity, temp_pos) == 0) {
                printf("OK.\n");
            } else {
                printf("Error.\n");
            }
            break;

        /*case 'f':
            if(list_find_highest_price_item_position(*list, (int *)&temp_pos) == 0) {
                printf("OK.\n");
                printf("Position of item: %u\n", temp_pos);
            } else {
                printf("Error.\n");
            }
            break;
        
        case 'c':
            if(list_cost_sum(*list, &temp_price) == 0) {
                printf("OK.\n");
                printf("Total cost: %.2f\n", temp_price);
            } else {
                printf("Error.\n");
            }
            break;*/

        case 's':
            printf("The first item position?\n");
            scanf("%u", &temp_pos);
            printf("The second item position?\n");
            scanf("%u", &temp_pos_b);

            if(list_swap_item_positions(list, temp_pos, temp_pos_b) == 0) {
                printf("OK.\n");
            } else {
                printf("Error.\n");
            }   
            break;

        /*case 'e':
            if(list_deduplicate(list) == 0) {
                printf("OK.\n");
            } else {
                printf("Error.\n");
            }
            break;

        case 'l':
            printf("Name of file to load?\n");
            scanf("%s", filename);
            if(list_load(list, filename) == 0) {
                printf("OK.\n");
            } else {
                printf("Error.\n");
            }
            break;

        case 'v':
            printf("Name of file to save?\n");
            scanf("%s", filename);
            if(list_save(*list, filename) == 0) {
                printf("OK.\n");
            } else {
                printf("Error.\n");
            }
            break;

        case 'p':
            if (list_print(*list) == 0) {
                printf("OK.\n");
            } else {
                printf("Error.\n");
            }
            break;

        case 'h':
            print_help();        
            break;
        case 'q':
            printf("Quit\n");
            return 1;
            break;
        default:
            printf("Error: Unknown command.\n");
            print_help();   
            break;  */  

    }
    return 0;
}

int main(int argc, char *argv[])
{
    node* head;
    list_init(&head);

    while(1)
    {
        // parse command line arguments
        // +1 to skip over the - (dash)
        int r = 0;
        char c;
        printf("=======================================\n");
        print_help();
        printf("Choice: ");
        scanf("%s", &c);
        r = parse_input(c, &head);
        if ( r == 1)
            break;
    }
    return 0;
}
