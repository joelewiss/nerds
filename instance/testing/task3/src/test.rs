#[allow(unused_imports)]
use crate::{LinkedList, LinkedListNode};

impl LinkedList {
    /// Put item onto the front of the linked list
    fn push_front(&mut self, item: i32) {
        // Take the value from head, construct new node with old head as next
        let next = self.head.take();
        self.head = Some(Box::new(LinkedListNode { val: item, next } ));
    }

    fn from_slice(s: &[i32]) -> Self {
        let mut l = Self::new();
        for val in s.iter().rev() {
            l.push_front(*val);
        }
        return l
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


pub fn run_tests() {
    let mut results = vec![];
    results.push(swap_empty_list_tests());
    results.push(swap_head_tail_tests());
    results.push(swap_mid_tests());
    results.push(swap_out_of_bounds_tests());
    results.push(swap_same_index_tests());

    println!();
    for result in results {
        println!("{result}");
    }
}



fn swap_empty_list_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING swap_empty_list_tests TESTS "));
    let mut all_passed = true;

    let mut l = LinkedList::new();

    let r = l.swap(0, 1);
    if r.is_ok() {
        println!("Test 1 FAILED: [].swap(0, 1)");
        println!("\t{:<16}error", "Expected:");
        println!("\t{:<16}{:?}", "Got list:", l.as_vec());
        all_passed = false;
    }

    let r = l.swap(5, 1);
    if r.is_ok() {
        println!("Test 2 FAILED: [].swap(0, 0)");
        println!("\t{:<16}error", "Expected:");
        println!("\t{:<16}{:?}", "Got list:", l.as_vec());
        all_passed = false;
    }

    println!("Finished");
    if all_passed {
        "swap_empty_list_tests: PASSED"
    } else {
        "swap_empty_list_tests: FAILED"
    }
}




fn swap_head_tail_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING swap_head_tail_tests TESTS "));
    let mut all_passed = true;

    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let result = l.swap(0, 2);
    if result.is_err() {
        println!("Test 1 FAILED: [1, 2, 3].swap(0, 2)");
        println!("\t{:<16}[3, 2, 1]", "Expected list:");
        println!("\t{:<16}{:?}", "Got error:", result.err());
        all_passed = false;
    } else if l.as_vec() != vec![3, 2, 1] {
        println!("Test 1 FAILED: [1, 2, 3].swap(0, 2)");
        println!("\t{:<16}[3, 2, 1]", "Expected list:");
        println!("\t{:<16}{:?}", "Got list:", l.as_vec());
        all_passed = false;
    }

    let mut l = LinkedList::from_slice(&[1, 2]);
    let result = l.swap(0, 1);
    if result.is_err() {
        println!("Test 2 FAILED: [1, 2].swap(0, 1)");
        println!("\t{:<16}[2, 1]", "Expected list:");
        println!("\t{:<16}{:?}", "Got error:", result.err());
        all_passed = false;
    } else if l.as_vec() != vec![2, 1] {
        println!("Test 2 FAILED: [1, 2].swap(0, 1)");
        println!("\t{:<16}[2, 1]", "Expected list:");
        println!("\t{:<16}{:?}", "Got list:", l.as_vec());
        all_passed = false;
    }

    println!("Finished");
    if all_passed {
        "swap_head_tail_tests: PASSED"
    } else {
        "swap_head_tail_tests: FAILED"
    }
}



fn swap_mid_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING swap_mid_tests TESTS "));
    let mut all_passed = true;

    let mut l = LinkedList::from_slice(&[10, 20, 30, 40]);
    let result = l.swap(1, 2);

    if result.is_err() {
        println!("Test 1 FAILED: [10, 20, 30, 40].swap(1, 2)");
        println!("\t{:<16}[10, 30, 20, 40]", "Expected list:");
        println!("\t{:<16}{:?}", "Got error:", result.err());
        all_passed = false;
    } else if l.as_vec() != vec![10, 30, 20, 40] {
        println!("Test 1 FAILED: [10, 20, 30, 40].swap(1, 2)");
        println!("\t{:<16}[10, 30, 20, 40]", "Expected list:");
        println!("\t{:<16}{:?}", "Got list:", l.as_vec());
        all_passed = false;
    }

    println!("Finished");
    if all_passed {
        "swap_mid_tests: PASSED"
    } else {
        "swap_mid_tests: FAILED"
    }
}




fn swap_out_of_bounds_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING swap_out_of_bounds_tests TESTS "));
    let mut all_passed = true;

    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let r = l.swap(0, 10);
    if r.is_ok() {
        println!("Test 1 FAILED: [1, 2, 3].swap(0, 10)");
        println!("\t{:<16}error", "Expected:");
        println!("\t{:<16}{:?}", "Got list:", l.as_vec());
        all_passed = false;
    }

    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let r = l.swap(3, 1);
    if r.is_ok() {
        println!("Test 2 FAILED: [1, 2, 3].swap(3, 1)");
        println!("\t{:<16}error", "Expected:");
        println!("\t{:<16}{:?}", "Got list:", l.as_vec());
        all_passed = false;
    }

    println!("Finished");
    if all_passed {
        "swap_out_of_bounds_tests: PASSED"
    } else {
        "swap_out_of_bounds_tests: FAILED"
    }
}



fn swap_same_index_tests() -> &'static str {
    println!();
    println!("{}", format!("{:-^100}", " RUNNING swap_same_index_tests TESTS "));
    let mut all_passed = true;

    let mut l = LinkedList::from_slice(&[1, 2, 3]);
    let before = l.as_vec();
    let r = l.swap(1, 1);

    if r.is_err() {
        println!("Test 1 FAILED: [1, 2, 3].swap(1, 1)");
        println!("\t{:<16}no error", "Expected:");
        println!("\t{:<16}{:?}", "Got error:", r.err());
        all_passed = false;
    }

    let after = l.as_vec();
    if before != after {
        println!("Test 1 FAILED: [1, 2, 3].swap(1, 1)");
        println!("\t{:<16}{:?}", "Expected list:", before);
        println!("\t{:<16}{:?}", "Got list:", after);
        all_passed = false;
    }

    println!("Finished");
    if all_passed {
        "swap_same_index_tests: PASSED"
    } else {
        "swap_same_index_tests: FAILED"
    }
}

