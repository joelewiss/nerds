#![allow(unused_imports)]
use crate::LinkedList;
use crate::LinkedListNode;

impl LinkedList {
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