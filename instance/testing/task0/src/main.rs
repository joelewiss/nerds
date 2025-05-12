// PRINTING LIST TASK
mod work;


fn main() {
    let l = LinkedList::new();
    println!("Printing Empty List\nResult:");
    l.print();
    println!();

    let mut l = LinkedList::new();
    l.push_front(15);
    println!("Printing list {:?}\nResult:", l.as_vec());
    l.print();
    println!();

    let mut l = LinkedList::new();
    l.push_front(10); l.push_front(5); l.push_front(7); l.push_front(-3); l.push_front(12);
    println!("Printing list {:?}\nResult:", l.as_vec());
    l.print();
    println!();

    let mut l = LinkedList::new();
    l.push_front(-5); l.push_front(2); l.push_front(0); l.push_front(3); l.push_front(10); l.push_front(2);
    println!("Printing list {:?}\nResult:", l.as_vec());
    l.print();
    println!();
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

    /// Put item onto the front of the linked list
    pub fn push_front(&mut self, item: i32) {
        // Take the value from head, construct new node with old head as next
        let next = self.head.take();
        self.head = Some(Box::new(LinkedListNode { val: item, next } ));
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