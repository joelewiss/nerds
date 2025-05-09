#![allow(unused_imports)]
use crate::LinkedList;
use crate::LinkedListNode;

impl LinkedList {
    /// Insert a new node into the list at index with val
    pub fn insert(&mut self, val: i32, index: usize) -> Result<(), String> {
        if index == 0 {
            self.push_front_a(val);
            return Ok(());
        }

        // Go to position-1, take value from next, construct new node and insert
        let Some(prev) = self.get_node_mut(index-1) else { return Err("index too large".to_string()) };

        let next = prev.next.take();
        let new = LinkedListNode { val, next };
        prev.next = Some(Box::new(new));
        Ok(())
    }

    fn get_node_mut(&mut self, index: usize) -> Option<&mut LinkedListNode> {
        let Some(mut node) = self.head.as_deref_mut() else { return None };
        for _ in 0..index {
            node = match &mut node.next {
                None => return None,
                Some(next) => next
            };
        }
        Some(node)
    }

    /// Put item onto the front of the linked list
    fn push_front_a(&mut self, item: i32) {
        // Take the value from head, construct new node with old head as next
        let next = self.head.take();
        self.head = Some(Box::new(LinkedListNode { val: item, next } ));
    }
}