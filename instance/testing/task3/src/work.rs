#![allow(unused_imports)]
use crate::LinkedList;
use crate::LinkedListNode;

impl LinkedList {

    /// Remove second node, swap with first node, insert first node in old place of second node
    pub fn swap(&mut self, a: usize, b: usize) -> Result<(), String> {
        if a == b { return Ok(()) }

        let first = a.min(b);
        let second = a.max(b);
        let Ok(mut second_node) = self.remove(second) else { return Err("b too large".to_string()) };
        
        // Swap first with second, get first
        // Special case for head
        let mut first_node = if first == 0 {
            let Some(mut head) = self.head.take() else { return Err("a too large".to_string()) };
            second_node.next = head.next.take();
            let first_node = head;
            self.head = Some(second_node);
            first_node
        } else {
            let Some(mut node) = self.head.as_mut() else { return Err("a too large".to_string()) };
            //fast forward node to first-1
            for _ in 0..first-1 {
                node = match &mut node.next {
                    None => return Err("a too large".to_string()),
                    Some(next) => next
                }
            }
            //swap first with second
            let Some(mut first_node) = node.next.take() else { return Err("a too large".to_string()) };
            second_node.next = first_node.next.take();
            node.next = Some(second_node);
            first_node
        };

        // Insert first where second was
        let Some(mut node) = self.head.as_mut() else { return Err("b too large".to_string()) };
        //fast forward node to second-1
        for _ in 0..second-1 {
            node = match &mut node.next {
                None => return Err("b too large".to_string()),
                Some(next) => next
            }
        }
        first_node.next = node.next.take();
        node.next = Some(first_node);
        Ok(())
    }

    /// Remove and return the node at the provided index
    pub fn remove(&mut self, index: usize) -> Result<Box<LinkedListNode>, String> {
        if self.head.is_none() {
            return Err("List is empty".to_string())
        }

        // Special case for the head
        if index == 0 {
            let mut removed = self.head.take().unwrap(); // unwrap is safe because above check
            self.head = removed.next.take();
            return Ok(removed)
        }

        // Go to index-1, take value of next, set next to next's next, return removed data
        let Some(prev) = self.get_node_mut(index-1) else { return Err("Index is too large".to_string()) };
        let Some(mut removed) = prev.next.take() else { return Err("Index is too large".to_string()) };
        prev.next = removed.next.take();
        Ok(removed)
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
}