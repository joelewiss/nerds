// INSERT INTO LIST TASK
mod work;
mod test;

fn main() {
    test::run_tests();
}


// IMPLEMENTATION CODE

pub struct LinkedList {
    pub head: Option<Box<LinkedListNode>>,
}
pub struct LinkedListNode {
    val: i32,
    pub next: Option<Box<LinkedListNode>>
}
impl LinkedListNode {
    pub fn new(val: i32) -> Self { Self { val, next: None } }
    pub fn get_val(&self) -> &i32 { &self.val }
}

impl LinkedList {
    pub fn new() -> Self { Self { head: None } }


    fn get_node_mut(&mut self, position: usize) -> Option<&mut LinkedListNode> {
        let Some(mut node) = self.head.as_deref_mut() else { return None };
        for _ in 0..position {
            node = match &mut node.next {
                None => return None,
                Some(next) => next
            };
        }
        Some(node)
    } 

    /// Put item onto the front of the linked list
    pub fn push_front(&mut self, item: i32) {
        // Take the value from head, construct new node with old head as next
        let next = self.head.take();
        self.head = Some(Box::new(LinkedListNode { val: item, next } ));
    }

    /// Insert item at position \
    /// Return error if the list is not large enough to accomodate this item
    // pub fn insert(&mut self, val: i32, index: usize) -> Result<(), String> {
    //     if index == 0 {
    //         self.push_front(val);
    //         return Ok(())
    //     }

    //     // Go to position-1, take value from next, construct new node and insert
    //     let Some(prev) = self.get_node_mut(index-1) else { return Err("Index too large".to_string()) };

    //     let next = prev.next.take();
    //     let new = LinkedListNode { val: val, next };
    //     prev.next = Some(Box::new(new));
    //     Ok(())
    // }

    /// Remove and return the node at the provided position
    pub fn remove(&mut self, index: usize) -> Result<Box<LinkedListNode>, String> {
        if self.head.is_none() {
            return Err("Index too large".to_string())
        }

        // Special case for the head
        if index == 0 {
            let mut removed = self.head.take().unwrap(); // unwrap is safe because above check
            self.head = removed.next.take();
            return Ok(removed)
        }

        // Go to position-1, take value of next, set next to next's next, return removed val
        let Some(prev) = self.get_node_mut(index-1) else { return Err("Index too large".to_string()) };
        let Some(mut removed) = prev.next.take() else { return Err("Index too large".to_string()) };
        prev.next = removed.next.take();
        Ok(removed)
    }

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
        let Some(mut node) = self.head.as_mut() else { return Err("a too large".to_string()) };
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




    /// Utility for testing so I can use vec comparison
    pub fn as_vec(&self) -> Vec<i32> {
        let mut ret = vec![];
        let mut node = &self.head;
        loop {
            match &node {
                None => return ret,
                Some(n) => {
                    ret.push(n.val);
                    node = &n.next;
                }
            }
        }
    }
}

